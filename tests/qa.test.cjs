const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load } = require("./helpers/load.cjs");
const { NextResponse } = require("next/server");
const crypto = require("node:crypto");

const auth = load(
  "lib/apiAuth.ts",
  { "node:crypto": crypto, "next/server": { NextResponse } },
  { Buffer, process: { env: { ADMIN_AUTH_SECRET: "qa-secret" } } }
);
const http = load("lib/http.ts", { "next/server": { NextResponse } });
const consultation = load("lib/consultation.ts", {}, { URLSearchParams });
const serviceCatalog = load("lib/serviceCatalog.ts", { "@/data/serviceDetails": load("data/serviceDetails.ts") });
const request = (body, token, method = "POST") =>
  new Request("http://localhost/api/test", {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(method !== "GET" ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}),
  });
const internal = auth.issueAdminToken({
  sub: "staff",
  email: "staff@example.test",
  name: "Staff",
  role: "internal",
  pageAccess: ["products"],
});
const superadmin = auth.issueAdminToken({
  sub: "admin",
  email: "admin@example.test",
  name: "Admin",
  role: "superadmin",
});

test("admin authorization rejects missing, forged, expired and out-of-scope tokens", () => {
  assert.equal(auth.requireAdmin(request({})).status, 401);
  assert.equal(auth.requireAdmin(request({}, internal + "tampered")).status, 401);
  // Build a genuinely expired signed token, independent of the issuer's TTL.
  const body = Buffer.from(
    JSON.stringify({ sub: "admin", email: "admin@example.test", role: "superadmin", exp: 0 })
  ).toString("base64url");
  const signature = crypto.createHmac("sha256", "qa-secret").update(body).digest("base64url");
  assert.equal(auth.requireAdmin(request({}, `cits_admin_jwt_${body}.${signature}`)).status, 401);
  assert.equal(auth.requireAdmin(request({}, internal), "contact").status, 403);
  assert.equal(auth.requireAdmin(request({}, internal), "products"), null);
  assert.equal(auth.requireAdmin(request({}, superadmin), "contact"), null);
});

test("private reads and content mutations refuse anonymous callers before accessing the database", async () => {
  const handlers = {
    "about/route.ts": ["PUT"],
    "contact/route.ts": ["PUT"],
    "landing/route.ts": ["PUT"],
    "services/route.ts": ["PUT"],
    "portfolio/route.ts": ["PUT"],
    "products/route.ts": ["POST"],
    "products/[id]/route.ts": ["PUT", "DELETE"],
    "clients/route.ts": ["POST"],
    "clients/[id]/route.ts": ["PUT", "DELETE"],
    "messages/route.ts": ["GET", "DELETE"],
    "messages/[id]/route.ts": ["DELETE"],
    "messages/[id]/status/route.ts": ["PATCH"],
    "messages/cleanup/route.ts": ["GET", "POST"],
    "uploads/route.ts": ["POST"],
  };
  for (const [file, methods] of Object.entries(handlers)) {
    const route = load(
      "app/api/" + file,
      {
        "next/server": { NextResponse },
        "@/lib/apiAuth": auth,
        "@/lib/http": http,
        "@/lib/consultation": consultation,
        "@/lib/serviceCatalog": serviceCatalog,
        "@/lib/db": {
          DbRepo: new Proxy(
            {},
            {
              get() {
                throw new Error("Unauthorized database access");
              },
            }
          ),
        },
        "@/config/inbox": { getMessageRetentionDays: () => 30 },
        "@/lib/email": {},
      },
      { process: { env: {} } }
    );
    for (const method of methods) {
      const response = await route[method](request({}, undefined, method), { params: Promise.resolve({ id: "test" }) });
      assert.equal(response.status, 401, `${method} ${file}`);
    }
  }
});

function messagesRoute(db) {
  return load(
    "app/api/messages/route.ts",
    {
      "next/server": { NextResponse },
      "@/lib/apiAuth": auth,
      "@/lib/http": http,
      "@/lib/consultation": consultation,
      "@/lib/serviceCatalog": serviceCatalog,
      "@/lib/db": { DbRepo: db },
      "@/config/inbox": {},
      "@/lib/email": { sendContactNotificationEmail: async () => {} },
    },
    { console: { error() {} } }
  );
}
const validMessage = {
  name: "QA",
  company: "Test",
  email: "qa@example.test",
  phone: "08123456789",
  message: "Konsultasi",
};

test("contact validation rejects malformed JSON, wrong types, whitespace, and invalid email without writing", async () => {
  const route = messagesRoute({ addMessage: () => assert.fail("Invalid message must not be saved") });
  for (const body of [
    "{",
    null,
    [],
    { ...validMessage, name: 123 },
    { ...validMessage, message: "   " },
    { ...validMessage, email: "invalid" },
    { ...validMessage, serviceRequested: {} },
  ]) {
    assert.equal((await route.POST(request(body))).status, 400, JSON.stringify(body));
  }
});

test("a saved contact submission stays successful when notification lookup fails and ignores supplied IDs", async () => {
  let saved;
  const route = messagesRoute({
    addMessage: async (body) => {
      saved = body;
      return { ...body, id: "server-id" };
    },
    getContactInfo: async () => {
      throw new Error("Notification unavailable");
    },
  });
  const response = await route.POST(request({ ...validMessage, id: "attacker-selected", name: " QA " }));
  assert.equal(response.status, 201);
  assert.equal(saved.name, "QA");
  assert.equal(saved.id, undefined);
  await new Promise((resolve) => setImmediate(resolve));
});

test("password database errors cannot fall back to the default credential", async () => {
  const sql = Object.assign(
    async () => {
      throw new Error("Database unavailable");
    },
    { unsafe: async () => {} }
  );
  const passwords = load(
    "lib/passwordServer.ts",
    { "node:crypto": crypto, "./db": { getSql: () => sql } },
    { console: { error() {} } }
  );
  await assert.rejects(passwords.verifyAdminCredential("admin", "admin"), /Verifikasi kata sandi/);
});

test("session lookup verifies signatures and preserves the internal account identity", async () => {
  const route = load("app/api/auth/me/route.ts", { "next/server": { NextResponse }, "@/lib/apiAuth": auth });
  assert.equal((await route.GET(request({}, "arbitrary", "GET"))).status, 401);
  const response = await route.GET(request({}, internal, "GET"));
  const body = await response.json();
  assert.equal(body.user.id, "staff");
  assert.equal(body.user.role, "Admin Internal");
});

test("invalid deal changes cannot partially update the read status", async () => {
  let writes = 0;
  const route = load("app/api/messages/[id]/status/route.ts", {
    "next/server": { NextResponse },
    "@/lib/apiAuth": auth,
    "@/lib/db": {
      DbRepo: {
        getMessages: async () => [{ id: "test" }],
        updateMessageStatus: async () => {
          writes++;
        },
      },
    },
  });
  const response = await route.PATCH(request({ status: "read", dealStage: "invalid" }, superadmin, "PATCH"), {
    params: Promise.resolve({ id: "test" }),
  });
  assert.equal(response.status, 400);
  assert.equal(writes, 0);
});

test("public product listings do not expose inactive products, while authenticated admins can request them", async () => {
  const route = load("app/api/products/route.ts", {
    "next/server": { NextResponse },
    "@/lib/apiAuth": auth,
    "@/lib/http": http,
    "@/lib/consultation": consultation,
    "@/lib/serviceCatalog": serviceCatalog,
    "@/lib/db": {
      DbRepo: { getActiveProducts: async () => [{ id: "active" }], getAllProducts: async () => [{ id: "inactive" }] },
    },
  });
  assert.equal((await route.GET(new Request("http://localhost/api/products?all=true"))).status, 401);
  const publicResponse = await route.GET(new Request("http://localhost/api/products"));
  assert.equal((await publicResponse.json()).data[0].id, "active");
  const adminResponse = await route.GET(
    new Request("http://localhost/api/products?all=true", { headers: { Authorization: `Bearer ${internal}` } })
  );
  assert.equal((await adminResponse.json()).data[0].id, "inactive");
});

test("login rejects invalid JSON and wrong field types before credential lookup", async () => {
  const route = load("app/api/auth/login/route.ts", {
    "next/server": { NextResponse },
    "@/lib/apiAuth": auth,
    "@/lib/http": http,
    "@/lib/consultation": consultation,
    "@/lib/serviceCatalog": serviceCatalog,
    "@/config/siteConfig": {},
    "@/lib/internalAccountsServer": {},
    "@/lib/profileServer": {},
    "@/lib/profile": {},
    "@/lib/passwordServer": {},
  });
  for (const body of ["{", null, [], { email: 5, password: "test" }, { email: "test", password: {} }]) {
    assert.equal((await route.POST(request(body))).status, 400);
  }
});

test("image upload rejects text fields, unsupported formats and oversized files", async () => {
  const route = load(
    "app/api/uploads/route.ts",
    { "next/server": { NextResponse }, "@/lib/apiAuth": auth },
    { File, Buffer }
  );
  for (const [file, expected] of [
    ["not a file", 400],
    [new File(["test"], "test.html", { type: "text/html" }), 400],
    [new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.png", { type: "image/png" }), 413],
  ]) {
    const form = new FormData();
    form.set("file", file);
    const response = await route.POST(
      new Request("http://localhost/api/uploads", {
        method: "POST",
        headers: { Authorization: `Bearer ${superadmin}` },
        body: form,
      })
    );
    assert.equal(response.status, expected);
  }
});

test("failed legacy migrations cannot report success and trigger deletion of the local accounts", async () => {
  const route = load(
    "app/api/auth/migrate-legacy/route.ts",
    {
      "next/server": { NextResponse },
      "@/lib/apiAuth": auth,
      "@/lib/http": http,
      "@/lib/consultation": consultation,
      "@/lib/serviceCatalog": serviceCatalog,
      "@/lib/internalAccountsServer": {
        migrateLegacyAccounts: async () => {
          throw new Error("Database offline");
        },
      },
    },
    { console: { error() {} } }
  );
  const response = await route.POST(request({ accounts: [] }, superadmin));
  assert.equal(response.status, 500);
  assert.equal((await response.json()).success, false);
});
