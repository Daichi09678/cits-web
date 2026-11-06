const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { load } = require("./helpers/load.cjs");
const runtime = { "react/jsx-runtime": require("react/jsx-runtime"), "lucide-react": require("lucide-react") };
const base = {
  description: "Arsip dan pelaporan",
  details: "",
  icon: "Package",
  features: ["REST API"],
  tags: ["Cloud"],
  isActive: true,
};
const products = [
  { ...base, id: "a", name: "Portal A", category: "Enterprise" },
  { ...base, id: "b", name: "Portal B", category: "Kategori Buatan" },
];
const nodes = (node) =>
  !React.isValidElement(node) ? [] : [node, ...React.Children.toArray(node.props.children).flatMap(nodes)];
const text = (node) =>
  typeof node === "string" || typeof node === "number"
    ? String(node)
    : React.Children.toArray(node?.props?.children).map(text).join("");
function hooks() {
  const values = [];
  let cursor = 0;
  return {
    reset: () => {
      cursor = 0;
    },
    react: {
      useState(initial) {
        const index = cursor++;
        if (!(index in values)) values[index] = initial;
        return [
          values[index],
          (next) => {
            values[index] = typeof next === "function" ? next(values[index]) : next;
          },
        ];
      },
      useRef(initial) {
        const index = cursor++;
        if (!(index in values)) values[index] = { current: initial };
        return values[index];
      },
    },
  };
}

test("the product category editor preserves unconfirmed choices and retries only products not yet saved", async () => {
  const state = hooks();
  const writes = [],
    categories = [];
  let closed = 0,
    fail = true;
  const Editor = load(
    "components/pages/admin-products/ProductCategoryEditor.tsx",
    { ...runtime, react: state.react },
    { Error }
  ).default;
  const render = () => {
    state.reset();
    return Editor({
      products,
      onSave: async (id, category) => {
        writes.push([id, category]);
        if (id === "b" && fail) throw new Error("Database offline");
      },
      onSaved: (category) => categories.push(category),
      onClose: () => {
        closed++;
      },
    });
  };
  const find = (fn) => nodes(render()).find(fn);
  find((node) => node.props.id === "new-product-category").props.onChange({ target: { value: "Kategori Baru" } });
  for (let index = 0; index < 2; index++)
    nodes(render())
      .filter((node) => node.type === "input" && node.props.type === "checkbox")
      [index].props.onChange({ target: { checked: true } });
  await find((node) => node.type === "form").props.onSubmit({ preventDefault() {} });
  assert.equal(closed, 0);
  assert.match(text(render()), /1 produk sudah diperbarui/);
  assert.match(text(render()), /Database offline/);
  fail = false;
  await find((node) => node.type === "form").props.onSubmit({ preventDefault() {} });
  assert.deepEqual(
    writes.map(([id]) => id),
    ["a", "b", "b"]
  );
  assert.deepEqual(categories, ["Kategori Baru"]);
  assert.equal(closed, 1);
});

function page(readOnly = false) {
  const state = hooks();
  let current = structuredClone(products),
    confirmed = true,
    fail = false;
  const writes = [],
    alerts = [];
  const Category = () => null;
  const Page = load(
    "app/(admin)/admin/products/page.tsx",
    {
      ...runtime,
      react: state.react,
      "@/lib/auth": { useAdminAuth: () => ({ session: { user: {} } }) },
      "@/lib/internalAccess": { canPerformAction: () => !readOnly },
      "@/components/admin/AdminTopbar": { default: () => null },
      "@/components/admin/CatalogDeleteDetails": load("components/admin/CatalogDeleteDetails.tsx", runtime),
      "@/components/admin/AdminDialogProvider": {
        useAdminDialog: () => ({
          confirm: async () => confirmed,
          alert: async (value) => {
            alerts.push(value);
          },
        }),
      },
      "@/stores/citsStore": {
        useCitsStore: () => ({
          products: current,
          actions: {
            updateProduct: async (id, patch) => {
              if (fail) throw new Error("Database offline");
              writes.push([id, patch]);
              current = current.map((item) => (item.id === id ? { ...item, ...patch } : item));
            },
          },
        }),
      },
      "@/components/admin/Pagination": { default: () => null },
      "@/components/admin/ChipField": { default: () => null },
      "@/components/pages/admin-products/ProductSpecificationFields": { default: () => null },
      "@/components/pages/admin-products/ProductCategoryEditor": { default: Category },
      "@/components/ui/ProductDetailsDialog": { default: () => null },
      "@/lib/catalogSearch": load("lib/catalogSearch.ts"),
    },
    { Error }
  ).default;
  const render = () => {
    state.reset();
    return Page();
  };
  const find = (fn) => nodes(render()).find(fn);
  return {
    render,
    find,
    writes,
    alerts,
    setConfirm: (value) => {
      confirmed = value;
    },
    setFail: (value) => {
      fail = value;
    },
    button: (label) => find((node) => node.type === "button" && text(node) === label),
    products: () => current,
  };
}

test("the original product category pills remain and only the matching category-management button is added", () => {
  const app = page();
  for (const label of ["All", "Enterprise", "Government", "Mobile", "Web", "Communication", "Tambah kategori"])
    assert.ok(app.button(label), label);
  assert.equal(nodes(app.render()).filter((node) => node.type === "select").length, 0);
  assert.equal(
    app.find((node) => node.props.title === "Lihat Detail Produk"),
    undefined
  );
  app.find((node) => node.props["aria-label"] === "Cari produk").props.onChange({ target: { value: "API arsip" } });
  assert.equal(nodes(app.render()).filter((node) => node.props.title === "Edit Produk").length, 2);
  app.find((node) => node.props["aria-label"] === "Cari produk").props.onChange({ target: { value: "API pisang" } });
  assert.equal(nodes(app.render()).filter((node) => node.props.title === "Edit Produk").length, 0);
});

test("deleting a created product category removes the filter and retains its products in General", async () => {
  const app = page();
  app.button("Kategori Buatan").props.onClick();
  await app.find((node) => node.props["aria-label"] === "Hapus kategori Kategori Buatan").props.onClick();
  assert.equal(app.products().length, 2);
  assert.equal(app.products()[1].category, "General");
  assert.equal(app.button("Kategori Buatan"), undefined);
  assert.ok(app.button("General"));
  assert.equal(app.button("All").props["aria-pressed"], true);
});

test("cancelled, failed and read-only category changes cannot pretend a filter was deleted", async () => {
  const app = page();
  app.setConfirm(false);
  const remove = () => app.find((node) => node.props["aria-label"] === "Hapus kategori Kategori Buatan");
  await remove().props.onClick();
  assert.equal(app.writes.length, 0);
  app.setConfirm(true);
  app.setFail(true);
  await remove().props.onClick();
  assert.ok(app.button("Kategori Buatan"));
  assert.match(app.alerts.at(-1).description, /Database offline/);
  const reader = page(true);
  assert.equal(reader.button("Tambah kategori"), undefined);
  assert.equal(
    reader.find((node) => node.props["aria-label"] === "Hapus kategori Kategori Buatan"),
    undefined
  );
});
