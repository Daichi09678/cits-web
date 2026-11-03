const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { load } = require("./helpers/load.cjs");
const catalog = load("lib/serviceCatalog.ts", { "@/data/serviceDetails": load("data/serviceDetails.ts") });
const base = { badge: "Layanan", icon: "Code2", desc: "Solusi perusahaan", sla: "Sesuai kesepakatan", features: [] };
const services = [
  {
    ...base,
    id: "cloud",
    title: "Cloud API",
    category: "Pengembangan",
    tags: ["Cloud"],
    isActive: true,
    showOnHome: true,
  },
  {
    ...base,
    id: "audit",
    title: "Audit TI",
    category: "Konsultasi",
    tags: ["Audit", "Cloud"],
    isActive: true,
    showOnHome: false,
  },
  {
    ...base,
    id: "server",
    title: "Server Enterprise",
    category: "All",
    tags: ["Managed Service"],
    isActive: false,
    showOnHome: true,
  },
];
const nodes = (node) =>
  !React.isValidElement(node) ? [] : [node, ...React.Children.toArray(node.props.children).flatMap(nodes)];
const text = (node) =>
  typeof node === "string" || typeof node === "number"
    ? String(node)
    : React.Children.toArray(node?.props?.children).map(text).join("");
const find = (tree, predicate) => nodes(tree).find(predicate);
const button = (tree, label) => find(tree, (node) => node.type === "button" && text(node) === label);

function app(readOnly = false) {
  const values = [];
  let cursor = 0;
  let currentServices = services.map((service) => ({ ...service }));
  let save = async () => {};
  const saved = [];
  const ChipField = () => null;
  const Component = load(
    "app/(admin)/admin/services/page.tsx",
    {
      react: {
        ...React,
        useState(initial) {
          const index = cursor++;
          if (!(index in values)) values[index] = typeof initial === "function" ? initial() : initial;
          return [
            values[index],
            (next) => {
              values[index] = typeof next === "function" ? next(values[index]) : next;
            },
          ];
        },
      },
      "react/jsx-runtime": require("react/jsx-runtime"),
      "lucide-react": require("lucide-react"),
      "@/components/admin/ServiceDetailsFields": { default: () => null, ServiceImageField: () => null },
      "@/components/ui/ServicePhoto": { default: () => null },
      "@/lib/serviceCatalog": catalog,
      "@/components/ui/useModalFocus": { useModalFocus: () => ({ current: null }) },
      "@/lib/auth": {
        useAdminAuth: () => ({
          session: {
            user: readOnly ? { role: "Admin Internal", permissions: { services: ["view"] } } : { role: "Super Admin" },
          },
        }),
      },
      "@/lib/internalAccess": load("lib/internalAccess.ts"),
      "@/components/admin/AdminTopbar": { default: () => null },
      "@/components/admin/AdminDialogProvider": { useAdminDialog: () => ({ alert() {} }) },
      "@/stores/citsStore": {
        useCitsStore: () => ({
          services: currentServices,
          actions: {
            saveServices: async (next) => {
              await save(next);
              saved.push(next);
              currentServices = next;
            },
          },
        }),
      },
      "@/lib/serviceIcons": { getPillarIcon: () => () => null, PILLAR_ICON_OPTIONS: [] },
      "@/components/admin/ChipField": { default: ChipField },
      "@/components/admin/Pagination": { default: () => null },
    },
    { crypto: require("node:crypto"), Error }
  ).default;
  const render = () => {
    cursor = 0;
    return Component();
  };
  const field = (id, value) => find(render(), (node) => node.props.id === id).props.onChange({ target: { value } });
  return {
    render,
    field,
    saved,
    ChipField,
    setSaver: (next) => {
      save = next;
    },
    visible: () =>
      nodes(render())
        .filter(
          (node) => node.type === "tr" && find(node, (child) => child.props["aria-label"]?.startsWith("Edit layanan "))
        )
        .map((node) => node.key),
    reset: () => button(render(), "Reset filter").props.onClick(),
  };
}

test("category and search filters remain available without the removed dropdowns", () => {
  const h = app();
  assert.equal(h.visible().length, 3);
  assert.equal(nodes(h.render()).filter((node) => node.type === "select").length, 0);
  button(h.render(), "Konsultasi").props.onClick();
  assert.equal(h.visible().length, 1);
  find(h.render(), (node) => node.props["aria-label"] === "Cari layanan").props.onChange({
    target: { value: "Server" },
  });
  assert.equal(h.visible().length, 0);
  h.reset();
  assert.equal(h.visible().length, 3);
  button(h.render(), "All").props.onClick();
  assert.equal(h.visible().length, 1);
  assert.match(text(h.render()), /Server Enterprise/);
});

test("adding a category persists assignments only after confirmation and keeps the draft on failure", async () => {
  const h = app();
  button(h.render(), "Tambah kategori").props.onClick();
  h.field("new-service-category", "Infrastruktur TI");
  const form = () => find(h.render(), (node) => node.type === "form" && node.props.id === "service-category-editor");
  find(form(), (node) => node.type === "input" && node.props.type === "checkbox").props.onChange({
    target: { checked: true },
  });
  h.setSaver(async () => {
    throw new Error("Database offline");
  });
  await form().props.onSubmit({ preventDefault() {} });
  assert.equal(h.saved.length, 0);
  assert.equal(find(form(), (node) => node.props.id === "new-service-category").props.value, "Infrastruktur TI");
  assert.match(text(form()), /Database offline/);
  let confirm;
  h.setSaver(
    () =>
      new Promise((resolve) => {
        confirm = resolve;
      })
  );
  const pending = form().props.onSubmit({ preventDefault() {} });
  assert.equal(h.saved.length, 0);
  assert.equal(button(form(), "Menyimpan...").props.disabled, true);
  confirm();
  await pending;
  assert.equal(h.saved[0][0].category, "Infrastruktur TI");
  assert.equal(h.saved[0][0].title, services[0].title);
  assert.deepEqual(h.saved[0][1], services[1]);
  assert.equal(button(h.render(), "Infrastruktur TI").props["aria-pressed"], true);
  assert.equal(h.visible().length, 1);
});

test("new service categories remain filterable and custom labels remain searchable", async () => {
  const h = app();
  button(h.render(), "Tambah Layanan Baru").props.onClick();
  h.field("service-title", "Layanan AI");
  h.field("service-category", "Kecerdasan Buatan");
  h.field("service-description", "Analisis data perusahaan");
  const chips = find(h.render(), (node) => node.type === h.ChipField && node.props.label === "Tags / Label");
  assert.ok(chips.props.presets.includes("Audit"));
  chips.props.onChange(["AI", "Cloud"]);
  await find(h.render(), (node) => node.type === "form").props.onSubmit({ preventDefault() {} });
  const created = h.saved[0].at(-1);
  assert.equal(created.category, "Kecerdasan Buatan");
  assert.deepEqual(Array.from(created.tags), ["AI", "Cloud"]);
  assert.equal(created.isActive, true);
  assert.ok(button(h.render(), "Kecerdasan Buatan"));
  find(h.render(), (node) => node.props["aria-label"] === "Cari layanan").props.onChange({ target: { value: "AI" } });
  assert.equal(h.visible().length, 1);
  assert.match(text(h.render()), /Layanan AI/);
});

test("read-only users can filter services without receiving category management controls", () => {
  const h = app(true);
  assert.equal(button(h.render(), "Tambah kategori"), undefined);
  assert.equal(button(h.render(), "Tambah Layanan Baru").props.disabled, true);
  button(h.render(), "Konsultasi").props.onClick();
  assert.equal(h.visible().length, 1);
});
