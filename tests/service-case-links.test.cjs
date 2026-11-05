const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { NextResponse } = require("next/server");
const { load } = require("./helpers/load.cjs");
const catalog = load("lib/serviceCatalog.ts");
const runtime = {
  "react/jsx-runtime": require("react/jsx-runtime"),
  "next/link": { default: (props) => React.createElement("a", props) },
};
const Links = load("components/pages/services/ServiceCaseStudyLinks.tsx", runtime).default;
const studies = [
  { id: "cs-1", title: "Proyek Pertama", isActive: true },
  { id: "cs-2", title: "Proyek Kedua", isActive: true },
  { id: "hidden", title: "Tidak aktif", isActive: false },
];
const service = {
  id: "service",
  title: "Layanan",
  badge: "Pilar",
  icon: "Code2",
  desc: "Deskripsi",
  sla: "Sesuai kontrak",
};

test("single and multiple related studies open the exact project detail using saved IDs", () => {
  const render = (ids, input = studies) => renderToStaticMarkup(React.createElement(Links, { ids, studies: input }));
  assert.match(render(["cs-1"]), /href="\/portfolio\/cs-1"/);
  assert.doesNotMatch(render(["cs-1"]), /href="\/portfolio"/);
  const multiple = render(["cs-1", "cs-2", "hidden", "removed"]);
  assert.match(multiple, /Lihat Studi Kasus \(2\)/);
  assert.match(multiple, /href="\/portfolio\/cs-2"/);
  assert.doesNotMatch(multiple, /hidden|removed/);
  assert.match(render(["cs-1"], [{ ...studies[0], title: "Judul yang diganti" }]), /href="\/portfolio\/cs-1"/);
  assert.doesNotMatch(render(["hidden", "removed"]), /href=/);
});

test("service validation persists stable study references and permits an explicitly empty catalog", () => {
  const parsed = catalog.parseServiceCatalog([{ ...service, caseStudyIds: ["cs-1", "cs-2"] }]);
  assert.equal(parsed.ok, true);
  assert.deepEqual(Array.from(parsed.value[0].caseStudyIds), ["cs-1", "cs-2"]);
  assert.deepEqual(Array.from(catalog.resolveServiceCatalog(parsed.value)[0].caseStudyIds), ["cs-1", "cs-2"]);
  assert.equal(catalog.parseServiceCatalog([]).ok, true);
  for (const ids of [[1], ["cs-1", "cs-1"], [""], "cs-1"])
    assert.equal(catalog.parseServiceCatalog([{ ...service, caseStudyIds: ids }]).ok, false);
});

test("clearing the final service requires delete permission and remains an empty persisted catalog", async () => {
  const permissions = [];
  let saved;
  const route = load("app/api/services/route.ts", {
    "next/server": { NextResponse },
    "@/lib/http": load("lib/http.ts", { "next/server": { NextResponse } }),
    "@/lib/apiAuth": {
      requireAdmin: async (_req, _page, action) => {
        permissions.push(action);
        return null;
      },
    },
    "@/lib/serviceCatalog": catalog,
    "@/lib/internalAccess": load("lib/internalAccess.ts"),
    "@/lib/db": {
      DbRepo: {
        getServices: async () => [service],
        updateServices: async (data) => {
          saved = data;
          return data;
        },
      },
    },
  });
  const result = await route.PUT(
    new Request("http://localhost/api/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: "[]",
    })
  );
  assert.equal(result.status, 200);
  assert.equal(saved.length, 0);
  assert.ok(permissions.includes("delete"));
  const sql = Object.assign(async () => [{ data: [] }], { json: (value) => value });
  const { DbRepo } = load(
    "lib/db.ts",
    {
      postgres: { default: () => sql },
      "@/data/initialData": new Proxy({}, { get: () => [] }),
      "@/config/inbox": {},
    },
    {
      process: { env: { DATABASE_URL: "postgres://localhost/test" } },
      _citsDbInitialized: true,
      _citsDbSchemaVersion: 8,
    }
  );
  assert.equal((await DbRepo.getServices()).length, 0);
});

test("the study picker offers active projects and can remove deleted or inactive references", () => {
  const Picker = load("components/pages/admin-services/ServiceCaseStudyPicker.tsx", {
    ...runtime,
  }).default;
  let value = ["cs-1", "removed", "hidden"];
  const render = () =>
    Picker({
      studies,
      value,
      onChange: (next) => {
        value = next;
      },
    });
  const html = renderToStaticMarkup(render());
  assert.match(html, /Proyek Pertama/);
  assert.doesNotMatch(html, /Tidak aktif/);
  const all = (node) =>
    !React.isValidElement(node) ? [] : [node, ...React.Children.toArray(node.props.children).flatMap(all)];
  all(render())
    .find((node) => node.type === "button")
    .props.onClick();
  assert.deepEqual(value, ["cs-1"]);
});
