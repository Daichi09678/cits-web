const { test } = require("node:test");
const assert = require("node:assert/strict");
const { NextResponse } = require("next/server");
const { load } = require("./helpers/load.cjs");
const { createTestAuth } = require("./helpers/auth.cjs");
const access = load("lib/internalAccess.ts");
const request = (token, method = "GET", body) =>
  new Request("http://localhost/api/test", {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

test("explicit permissions require view, reject unknown modules/actions, and preserve legacy assignments", () => {
  const permissions = access.normalizePermissions({
    products: ["create", "delete"],
    clients: ["view", "create", "invented"],
    unknown: ["view"],
    services: ["view", "delete"],
  });
  assert.equal(permissions.products, undefined);
  assert.deepEqual(Array.from(permissions.clients), ["view", "create"]);
  assert.deepEqual(Array.from(permissions.services), ["view"]);
  assert.equal(permissions.unknown, undefined);
  for (const value of [false, "all", ["products"], {}])
    assert.equal(Object.keys(access.normalizePermissions(value)).length, 0);
  const legacy = { role: "Admin Internal", pageAccess: ["products"] };
  assert.equal(access.canPerformAction(legacy, "products", "delete"), true);
  assert.equal(access.canPerformAction({ ...legacy, permissions: {} }, "products", "view"), false);
  assert.equal(access.canPerformAction({ ...legacy, permissions: { products: ["view"] } }, "products", "edit"), false);
  assert.equal(access.canAccessPage({ ...legacy, permissions: { products: ["edit"] } }, "products"), false);
});

test("new administrator passwords require all four character groups and bounded length", () => {
  for (const password of [
    "Aa1!",
    "lowercase1!",
    "UPPERCASE1!",
    "NoNumbers!",
    "NoSymbols12",
    "Valid1!" + "x".repeat(128),
  ])
    assert.ok(access.validateAccountPassword(password));
  assert.equal(access.validateAccountPassword("ValidPass1!"), null);
});

test("server uses current account permissions and immediately rejects deactivated/deleted accounts", async () => {
  const auth = createTestAuth();
  const token = auth.issueAdminToken({
    sub: "staff",
    email: "staff@example.test",
    name: "Staff",
    role: "internal",
    pageAccess: ["products"],
    permissions: { products: ["view", "create", "edit", "delete"] },
  });
  assert.equal(await auth.requireAdmin(request(token, "DELETE"), "products"), null);
  auth.accounts.get("staff").permissions = { products: ["view"] };
  assert.equal((await auth.requireAdmin(request(token, "DELETE"), "products")).status, 403);
  assert.equal((await auth.requireAdmin(request(token, "POST"), "products")).status, 403);
  assert.equal((await auth.requireAdmin(request(token, "PUT"), "products")).status, 403);
  assert.equal(await auth.requireAdmin(request(token), "products"), null);
  auth.accounts.get("staff").isActive = false;
  assert.equal((await auth.requireAdmin(request(token), "products")).status, 401);
  auth.accounts.delete("staff");
  assert.equal((await auth.requireAdmin(request(token), "products")).status, 401);
  auth.accounts.get = () => {
    throw new Error("Database offline");
  };
  assert.equal((await auth.requireAdmin(request(token), "products")).status, 503);
});

test("API action checks reject read-only product/clients mutations before reaching storage", async () => {
  const auth = createTestAuth();
  const token = auth.issueAdminToken({
    sub: "viewer",
    email: "viewer@example.test",
    name: "Viewer",
    role: "internal",
    permissions: { products: ["view"], clients: ["view"] },
  });
  const http = load("lib/http.ts", { "next/server": { NextResponse } });
  for (const moduleKey of ["products", "clients"])
    for (const [file, methods] of [
      ["route.ts", ["POST"]],
      ["[id]/route.ts", ["PUT", "DELETE"]],
    ]) {
      const route = load(`app/api/${moduleKey}/${file}`, {
        "next/server": { NextResponse },
        "@/lib/apiAuth": auth,
        "@/lib/http": http,
        "@/lib/db": { DbRepo: new Proxy({}, { get: () => assert.fail("Read-only caller reached storage") }) },
      });
      for (const method of methods)
        assert.equal(
          (await route[method](request(token, method, {}), { params: Promise.resolve({ id: "record" }) })).status,
          403
        );
    }
});

function repository(sql) {
  return load(
    "lib/internalAccountsServer.ts",
    { "./db": { getSql: () => sql }, "./internalAccess": access },
    { console: { error() {} } }
  );
}

test("account operations refuse unavailable persistence and never fall back to successful memory writes", async () => {
  for (const sql of [
    null,
    Object.assign(
      async () => {
        throw new Error("DB unavailable");
      },
      { unsafe: async () => {} }
    ),
  ]) {
    const repo = repository(sql);
    await assert.rejects(repo.listInternalAccounts(), /Database akun/);
    await assert.rejects(
      repo.createInternalAccount({
        name: "QA",
        email: "qa@example.test",
        password: "ValidPass1!",
        pageAccess: ["products"],
        isActive: true,
      }),
      /Database akun/
    );
    await assert.rejects(repo.deleteInternalAccount("staff"), /Database akun/);
  }
});

test("primary superadmin cannot be downgraded or deleted, including direct repository calls", async () => {
  const repo = repository(null);
  assert.equal((await repo.deleteInternalAccount("admin-1")).success, false);
  assert.equal(
    (
      await repo.updateInternalAccount("admin-1", {
        name: "Changed",
        email: "qa@example.test",
        pageAccess: [],
        isActive: false,
      })
    ).success,
    false
  );
});

test("server persists action permissions with the account and derives navigation from view permission", async () => {
  let row;
  const sql = Object.assign(
    async (strings, ...values) => {
      const query = strings.join("?");
      if (query.includes("INSERT INTO internal_accounts")) {
        row = {
          id: values[0],
          name: values[1],
          email: values[2],
          password_hash: values[3],
          password_salt: values[4],
          password_algo: values[5],
          page_access: values[6],
          permissions: values[7],
          is_active: values[8],
          created_at: values[9],
          updated_at: values[10],
        };
        return [row];
      }
      return row ? [row] : [];
    },
    { unsafe: async () => {}, json: (value) => value }
  );
  const repo = repository(sql);
  const result = await repo.createInternalAccount({
    name: " QA ",
    email: "QA@example.test",
    password: "ValidPass1!",
    pageAccess: ["products", "clients"],
    permissions: { products: ["view", "edit"], clients: ["delete"] },
    isActive: true,
  });
  assert.equal(result.success, true);
  assert.equal(result.account.name, "QA");
  assert.equal(result.account.email, "qa@example.test");
  assert.deepEqual(Array.from(result.account.pageAccess), ["products"]);
  assert.deepEqual(Array.from(result.account.permissions.products), ["view", "edit"]);
  assert.notEqual(row.password_hash, "ValidPass1!");
  assert.equal(result.account.passwordHash, undefined);
  const saved = (await repo.listInternalAccounts())[0];
  assert.deepEqual(Array.from(saved.permissions.products), ["view", "edit"]);
  assert.equal(saved.permissions.clients, undefined);
});

test("browser permission guard blocks unauthorized optimistic changes before mutation", () => {
  const user = { role: "Admin Internal", pageAccess: ["products"], permissions: { products: ["view"] } };
  const guard = load(
    "lib/actionAccessClient.ts",
    { "@/config/siteConfig": { siteConfig: { admin: { sessionKey: "session" } } }, "./internalAccess": access },
    { localStorage: { getItem: () => JSON.stringify({ user }) } }
  );
  assert.throws(() => guard.assertPageAction("products", "edit"), /izin/);
  user.permissions.products.push("edit");
  assert.doesNotThrow(() => guard.assertPageAction("products", "edit"));
  assert.throws(() => guard.assertPageAction("clients", "view"), /izin/);
});

test("account and reset clients require explicit server success and preserve unconfirmed legacy accounts", async () => {
  const globals = { fetch: async () => ({ ok: true, json: async () => ({}) }) };
  const accounts = load("lib/internalAccountsApi.ts", { "./internalAccess": access }, globals);
  const passwords = load("lib/passwordApi.ts", {}, globals);
  await assert.rejects(accounts.deleteInternalAccount("staff"));
  await assert.rejects(passwords.sendAdminResetLink("staff@example.test"));
  assert.equal(await accounts.migrateLegacyAccounts([{ email: "legacy@example.test" }]), null);
});
