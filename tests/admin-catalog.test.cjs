const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load } = require("./helpers/load.cjs");
const access = load("lib/internalAccess.ts");
function store(api) {
  const cache = new Map([
    ["products", JSON.stringify([{ id: "p1", name: "Existing", isActive: true }])],
    ["clients", JSON.stringify([{ id: "c1", name: "Mitra", isActive: true }])],
    ["portfolio", JSON.stringify([{ id: "cs1", title: "Project", isActive: true }])],
  ]);
  const { CitsStore } = load(
    "stores/citsStore.ts",
    {
      react: {},
      "@/data/initialData": new Proxy({}, { get: () => [] }),
      "@/config/siteConfig": {
        siteConfig: { storageKeys: { products: "products", clients: "clients", portfolio: "portfolio" } },
      },
      "@/lib/api": { citsApi: api },
      "@/lib/internalAccess": access,
      "@/lib/actionAccessClient": { assertPageAction: () => {} },
      "@/lib/audio": {},
    },
    {
      crypto: require("node:crypto"),
      window: { dispatchEvent: () => {} },
      localStorage: { getItem: (key) => cache.get(key), setItem: (key, value) => cache.set(key, value) },
      Event: class {},
    }
  );
  return { actions: CitsStore, read: (key) => JSON.parse(cache.get(key)) };
}
test("product creation and status changes appear only after server confirmation", async () => {
  let confirm;
  const app = store({
    createProduct: () =>
      new Promise((resolve) => {
        confirm = resolve;
      }),
    updateProduct: async (id, updates) => ({ success: true, data: { id, name: "New", ...updates } }),
  });
  const pending = app.actions.addProduct({ name: "New", description: "Dynamic", isActive: false });
  assert.equal(app.read("products").length, 1);
  confirm({ success: true, data: { id: "confirmed-product", name: "New", isActive: false } });
  await pending;
  assert.equal(app.read("products")[0].id, "confirmed-product");
  await app.actions.toggleProductStatus("confirmed-product");
  assert.equal(app.read("products")[0].isActive, true);
});
test("failed product, client and portfolio changes retain their previously saved contents", async () => {
  const failure = async () => ({ success: false, message: "Database unavailable" });
  const app = store({
    updateProduct: failure,
    deleteProduct: failure,
    createClient: failure,
    updateClient: failure,
    deleteClient: failure,
    updatePortfolio: failure,
  });
  const before = JSON.stringify(["products", "clients", "portfolio"].map((key) => app.read(key)));
  for (const change of [
    () => app.actions.toggleProductStatus("p1"),
    () => app.actions.deleteProduct("p1"),
    () => app.actions.addClient({ name: "New" }),
    () => app.actions.updateClient("c1", { isActive: false }),
    () => app.actions.deleteClient("c1"),
    () => app.actions.saveCaseStudies([{ id: "cs1", title: "Changed", isActive: false }]),
  ])
    await assert.rejects(change, /Database unavailable/);
  assert.equal(JSON.stringify(["products", "clients", "portfolio"].map((key) => app.read(key))), before);
});
test("confirmed removals also preserve an explicitly empty catalog", async () => {
  const app = store({
    deleteProduct: async () => ({ success: true }),
    deleteClient: async () => ({ success: true }),
    updatePortfolio: async () => ({ success: true, data: [] }),
  });
  await app.actions.deleteProduct("p1");
  await app.actions.deleteClient("c1");
  await app.actions.deleteCaseStudy("cs1");
  assert.deepEqual(app.read("products"), []);
  assert.deepEqual(app.read("clients"), []);
  assert.deepEqual(app.read("portfolio"), []);
});
