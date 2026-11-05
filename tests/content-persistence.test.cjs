const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load } = require("./helpers/load.cjs");

function database(query, configured = true) {
  const sql = Object.assign(query, { json: (value) => value });
  return load(
    "lib/db.ts",
    {
      postgres: { default: () => sql },
      "@/data/initialData": new Proxy(
        {},
        { get: (_, key) => (key === "initialCaseStudies" ? [{ id: "default-project" }] : []) }
      ),
      "@/config/inbox": { getMessageRetentionDays: () => 30 },
    },
    {
      process: { env: configured ? { DATABASE_URL: "postgres://localhost/test" } : {} },
      _citsDbInitialized: true,
      _citsDbSchemaVersion: 8,
      console: { error() {}, warn() {} },
    }
  ).DbRepo;
}

test("client and portfolio writes cannot claim success when persistence is unavailable", async () => {
  for (const configured of [true, false]) {
    const repo = database(async () => {
      throw new Error("Database offline");
    }, configured);
    const client = { id: "c1", name: "Mitra baru", logo: "/logo.webp", category: "Swasta", isActive: true };
    for (const operation of [
      () => repo.createClient(client),
      () => repo.updateClient("c1", { logo: "/new-logo.webp" }),
      () => repo.deleteClient("c1"),
      () => repo.updatePortfolio([]),
      () =>
        repo.createProduct({
          id: "p1",
          name: "Produk",
          category: "Web",
          description: "Deskripsi",
          features: [],
          tags: [],
          isActive: true,
        }),
      () => repo.updateProduct("p1", { details: "Penjelasan baru", specifications: [] }),
      () => repo.deleteProduct("p1"),
    ])
      await assert.rejects(operation, /Database offline|Database belum dikonfigurasi/);
  }
});

test("a deliberately emptied portfolio remains empty after a new server process reads it", async () => {
  const repo = database(async () => [{ data: [] }]);
  assert.deepEqual(Array.from(await repo.getPortfolio()), []);
});

test("failed profile and catalog reads reject rather than restoring default content", async () => {
  const repo = database(async () => {
    throw new Error("Database offline");
  });
  for (const method of ["getAboutData", "getClients", "getPortfolio", "getAllProducts", "getServices"])
    await assert.rejects(() => repo[method](), /Database offline/);
});

test("content API clients reject failed reads and portfolio saves even if a body contains data", async () => {
  const { citsApi } = load(
    "lib/api.ts",
    { "./actionAccessClient": { assertPageAction() {} } },
    { fetch: async () => ({ ok: false, json: async () => ({ success: true, data: [], message: "Save rejected" }) }) }
  );
  for (const method of ["getAboutData", "getClients", "getPortfolio"])
    await assert.rejects(() => citsApi[method](), /Save rejected/);
  await assert.rejects(() => citsApi.updatePortfolio([]), /Save rejected/);
});

test("confirmed edits and deletions still update the local view when browser storage is full", async () => {
  const events = [];
  const { CitsStore } = load(
    "stores/citsStore.ts",
    {
      react: {},
      "@/data/initialData": new Proxy({}, { get: () => [] }),
      "@/config/siteConfig": { siteConfig: { storageKeys: { clients: "clients", portfolio: "portfolio" } } },
      "@/lib/api": {
        citsApi: {
          createClient: async (client) => ({ success: true, data: client }),
          deleteClient: async () => ({ success: true }),
          updatePortfolio: async (data) => ({ success: true, data }),
        },
      },
      "@/lib/actionAccessClient": { assertPageAction() {} },
      "@/lib/internalAccess": { collectionPermissionActions: () => [] },
      "@/lib/audio": {},
    },
    {
      crypto: require("node:crypto"),
      window: { dispatchEvent: (event) => events.push(event.type) },
      localStorage: {
        getItem: () => null,
        setItem: () => {
          throw new Error("Quota exceeded");
        },
      },
      Event: class {
        constructor(type) {
          this.type = type;
        }
      },
    }
  );
  const client = await CitsStore.addClient({
    name: "Logo baru",
    logo: "data:image/png;base64," + "A".repeat(400),
    isActive: true,
  });
  assert.equal(CitsStore.getClients()[0].logo, client.logo);
  await CitsStore.deleteClient(client.id);
  assert.equal(CitsStore.getClients().length, 0);
  await CitsStore.saveCaseStudies([{ id: "project", title: "Proyek baru" }]);
  assert.equal(CitsStore.getCaseStudies()[0].title, "Proyek baru");
  await CitsStore.saveCaseStudies([]);
  assert.equal(CitsStore.getCaseStudies().length, 0);
  assert.equal(events.length, 4);
});
