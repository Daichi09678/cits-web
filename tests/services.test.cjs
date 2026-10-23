const { test } = require("node:test"),
  assert = require("node:assert/strict"),
  { NextResponse } = require("next/server"),
  { load } = require("./helpers/load.cjs");
const catalog = load("lib/serviceCatalog.ts", { "@/data/serviceDetails": load("data/serviceDetails.ts") });
const http = load("lib/http.ts", { "next/server": { NextResponse } });
const service = {
  id: "pillar-1",
  title: "Layanan Web",
  badge: "Pilar 01",
  icon: "Code2",
  desc: "Deskripsi ringkas",
  sla: "Sesuai kesepakatan",
  isActive: true,
  features: ["Integrasi, pelaporan, dan arsip"],
  image: "/services/it-consultant.webp",
  details: "Penjelasan lengkap dari admin",
  techStack: ["Standar API"],
  caseStudies: ["Implementasi portal"],
  deliverables: [{ label: "Dokumentasi", description: "Panduan pengguna dan pengelola" }],
};
const request = (body) =>
  new Request("http://localhost/api/services", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
test("edited service photos and full details override the defaults on both public pages", () => {
  const data = catalog.resolveServiceCatalog([service])[0];
  assert.equal(data.image, service.image);
  assert.equal(data.details, service.details);
  assert.deepEqual(Array.from(data.features), service.features);
  assert.deepEqual(Array.from(data.techStack), service.techStack);
  assert.equal(data.deliverables[0].description, service.deliverables[0].description);
  const cleared = catalog.resolveServiceCatalog([
    { ...service, features: [], techStack: [], caseStudies: [], deliverables: [], details: "" },
  ])[0];
  for (const key of ["features", "techStack", "caseStudies", "deliverables"]) assert.equal(cleared[key].length, 0);
  assert.equal(cleared.details, "");
});
test("service validation rejects invalid images, duplicate IDs, malformed lists and oversized details", () => {
  for (const entry of [
    { ...service, image: "javascript:alert(1)" },
    { ...service, image: "//other-site/image.png" },
    { ...service, image: "data:image/svg+xml;base64,AAAA" },
    { ...service, details: "x".repeat(8001) },
    { ...service, features: [{}] },
    { ...service, deliverables: [{ label: "Only title" }] },
    { ...service, isActive: "false" },
  ])
    assert.equal(catalog.parseServiceCatalog([entry]).ok, false);
  assert.equal(catalog.parseServiceCatalog([service, service]).ok, false);
  for (const image of ["/services/test.webp", "https://example.test/photo.jpg", "data:image/png;base64,aGVsbG8="])
    assert.equal(catalog.parseServiceCatalog([{ ...service, image }]).ok, true);
});
test("services API persists the validated image and all details and rejects bad payloads before storage", async () => {
  let saved;
  const route = load("app/api/services/route.ts", {
    "next/server": { NextResponse },
    "@/lib/apiAuth": { requireAdmin: () => null },
    "@/lib/http": http,
    "@/lib/serviceCatalog": catalog,
    "@/lib/db": {
      DbRepo: {
        updateServices: async (data) => {
          saved = data;
          return data;
        },
      },
    },
  });
  assert.equal((await route.PUT(request([service]))).status, 200);
  assert.equal(saved[0].image, service.image);
  assert.equal(saved[0].details, service.details);
  assert.equal(saved[0].deliverables[0].description, service.deliverables[0].description);
  saved = undefined;
  assert.equal((await route.PUT(request([{ ...service, techStack: [4] }]))).status, 400);
  assert.equal(saved, undefined);
});
test("failed service saves cannot replace cached content or report success", async () => {
  const storage = new Map([["services", JSON.stringify([service])]]),
    events = [];
  let finish;
  let response = new Promise((resolve) => {
    finish = resolve;
  });
  const { CitsStore } = load(
    "stores/citsStore.ts",
    {
      react: {},
      "@/data/initialData": new Proxy({}, { get: () => [] }),
      "@/config/siteConfig": { siteConfig: { storageKeys: { services: "services" } } },
      "@/lib/api": { citsApi: { updateServices: () => response } },
      "@/lib/audio": {},
    },
    {
      window: { dispatchEvent: (e) => events.push(e) },
      localStorage: { getItem: (key) => storage.get(key), setItem: (key, val) => storage.set(key, val) },
      Event: class {
        constructor(type) {
          this.type = type;
        }
      },
    }
  );
  const updated = [{ ...service, title: "Updated" }];
  const pending = CitsStore.saveServices(updated);
  assert.equal(JSON.parse(storage.get("services"))[0].title, service.title);
  finish({ success: true, data: updated });
  await pending;
  assert.equal(JSON.parse(storage.get("services"))[0].title, "Updated");
  assert.equal(events.length, 1);
  response = Promise.reject(Error("Server offline"));
  await assert.rejects(CitsStore.saveServices([service]), /offline/);
  assert.equal(JSON.parse(storage.get("services"))[0].title, "Updated");
  assert.equal(events.length, 1);
});
test("service client rejects failed HTTP responses even when a response body exists", async () => {
  const { citsApi } = load(
    "lib/api.ts",
    {},
    { fetch: async () => ({ ok: false, json: async () => ({ success: false, message: "Tidak tersimpan" }) }) }
  );
  await assert.rejects(citsApi.updateServices([service]), /Tidak tersimpan/);
});
test("service repository failures preserve prior content instead of claiming a durable save", async () => {
  const memory = { services: [service] };
  const sql = Object.assign(
    async () => {
      throw Error("database offline");
    },
    { json: (v) => v }
  );
  const { DbRepo } = load(
    "lib/db.ts",
    { postgres: { default: () => sql }, "@/data/initialData": new Proxy({}, { get: () => [] }), "@/config/inbox": {} },
    {
      _citsMemoryDb: memory,
      _citsDbInitialized: true,
      _citsDbSchemaVersion: 3,
      process: { env: { DATABASE_URL: "postgres://localhost/test" } },
      console: { error() {} },
    }
  );
  await assert.rejects(DbRepo.updateServices([{ ...service, title: "Changed" }]), /database offline/);
  assert.equal(memory.services[0].title, service.title);
});
