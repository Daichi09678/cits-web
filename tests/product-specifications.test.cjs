const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { NextResponse } = require("next/server");
const { load } = require("./helpers/load.cjs");
const search = load("lib/catalogSearch.ts");
const validation = load("lib/productValidation.ts");
const product = {
  id: "p1",
  name: "Portal Arsip",
  category: "Kategori Kustom",
  description: "Arsip instansi",
  details: "Penjelasan lengkap dari admin",
  features: ["Integrasi REST API"],
  tags: ["Cloud"],
  specifications: [{ name: "Basis data", value: "PostgreSQL" }],
  icon: "Package",
  isActive: true,
  showOnHome: true,
  updatedAt: new Date().toISOString(),
};
const runtime = {
  react: React,
  "react/jsx-runtime": require("react/jsx-runtime"),
  "lucide-react": require("lucide-react"),
};

test("product search combines words across saved fields, features, tags and specification values", () => {
  for (const query of ["POSTGRESQL arsip", "api cloud", "kategori basis", "penjelasan portal", "  Cloud   REST-API "])
    assert.equal(search.filterProducts([product], { ...search.emptyProductFilters, query }).length, 1, query);
  assert.equal(search.filterProducts([product], { ...search.emptyProductFilters, query: "portal pisang" }).length, 0);
  assert.equal(
    search.filterProducts([product], { ...search.emptyProductFilters, category: "Kategori Kustom", query: "api cloud" })
      .length,
    1
  );
  assert.equal(
    search.filterProducts([product], { ...search.emptyProductFilters, category: "Kategori lainnya" }).length,
    0
  );
});

test("product specification validation accepts custom categories and rejects malformed or duplicate specifications", () => {
  assert.deepEqual(
    JSON.parse(JSON.stringify(validation.parseProductPatch(product).specifications)),
    product.specifications
  );
  for (const patch of [
    { details: 12 },
    { specifications: [{ name: "", value: "x" }] },
    {
      specifications: [
        { name: "DB", value: "A" },
        { name: " db ", value: "B" },
      ],
    },
    { specifications: [{}] },
    { specifications: Array(51).fill({ name: "x", value: "y" }) },
    { tags: [12] },
  ])
    assert.throws(() => validation.parseProductPatch(patch));
  assert.equal(validation.parseProductPatch({ details: "", specifications: [], image: "" }).specifications.length, 0);
});

test("product APIs preserve complete specifications and reject invalid updates before persistence", async () => {
  let saved;
  const overrides = {
    "next/server": { NextResponse },
    "@/lib/apiAuth": { requireAdmin: () => null },
    "@/lib/http": load("lib/http.ts", { "next/server": { NextResponse } }),
    "@/lib/productValidation": validation,
    "@/lib/db": {
      DbRepo: {
        createProduct: async (data) => {
          saved = data;
          return data;
        },
        updateProduct: async (id, patch) => {
          saved = { ...product, ...patch, id };
          return saved;
        },
      },
    },
  };
  const req = (body, method) =>
    new Request("http://localhost/api/products", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  const create = load("app/api/products/route.ts", overrides);
  assert.equal((await create.POST(req(product, "POST"))).status, 201);
  assert.equal(saved.details, product.details);
  assert.equal(saved.specifications[0].value, "PostgreSQL");
  const update = load("app/api/products/[id]/route.ts", overrides);
  assert.equal(
    (
      await update.PUT(req({ details: "", specifications: [], image: "" }, "PUT"), {
        params: Promise.resolve({ id: "p1" }),
      })
    ).status,
    200
  );
  assert.equal(saved.specifications.length, 0);
  saved = null;
  assert.equal(
    (await update.PUT(req({ specifications: [{ name: "DB" }] }, "PUT"), { params: Promise.resolve({ id: "p1" }) }))
      .status,
    400
  );
  assert.equal(saved, null);
});

test("public product details and admin preview display the same saved category, tags and specifications", () => {
  const Dialog = load("components/ui/ProductDetailsDialog.tsx", {
    ...runtime,
    "next/link": { default: (props) => React.createElement("a", props) },
    "@/components/ui/ProductPhoto": { default: () => null },
    "@/components/ui/useModalFocus": { useModalFocus: () => ({ current: null }) },
    "@/lib/consultation": load("lib/consultation.ts", {}, { URLSearchParams }),
    "@/lib/productDetails": load("lib/productDetails.ts"),
  }).default;
  for (const preview of [false, true]) {
    const html = renderToStaticMarkup(React.createElement(Dialog, { product, preview, onClose() {} }));
    for (const value of [
      product.name,
      product.category,
      product.details,
      "Tag / Kata Kunci",
      "Cloud",
      "Basis data",
      "PostgreSQL",
    ])
      assert.ok(html.includes(value), value);
    assert.equal(html.includes("Konsultasi Produk"), !preview);
  }
});
