const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { load } = require("./helpers/load.cjs");
const serviceCatalog = load("lib/serviceCatalog.ts", { "@/data/serviceDetails": load("data/serviceDetails.ts") });
const finder = load("lib/catalogFinder.ts", { "@/lib/serviceCatalog": serviceCatalog });
const consultation = load("lib/consultation.ts", {}, { URLSearchParams });
const defaults = finder.EMPTY_CATALOG_FILTERS;
const service = (id, category, features, techStack = [], extra = {}) => ({
  id,
  title: id,
  desc: "Deskripsi layanan",
  category,
  features,
  techStack,
  tags: [],
  badge: "Layanan",
  icon: "Code2",
  sla: "Dukungan 24/7",
  isActive: true,
  ...extra,
});
const services = [
  service("Aplikasi", "Pengembangan", ["Integrasi API", "Aplikasi Web"], ["PostgreSQL", "React"], {
    tags: ["Satu Data"],
    details: "Pelaporan investasi",
    deliverables: [{ label: "Dokumentasi", description: "Panduan pengguna" }],
  }),
  service("Audit", "Konsultasi", ["Audit Keamanan"], ["ISO 27001"], { tags: ["SPBE"] }),
  service("Server", "Infrastruktur", ["Server Rackmount", "Jaringan"], ["Cisco"]),
  service("Hidden", "Rahasia", ["Fitur rahasia"], ["Teknologi rahasia"], { showOnHome: false }),
  service("Inactive", "Internal", ["Fitur internal"], [], { isActive: false }),
];

test("catalog choices and search fields come from active, homepage-selected admin content", () => {
  const catalog = finder.buildFeaturedCatalog(services, []);
  assert.deepEqual(
    Array.from(catalog, (item) => item.title),
    ["Aplikasi", "Audit", "Server"]
  );
  const result = finder.filterFeaturedCatalog(catalog, defaults);
  assert.deepEqual(Array.from(result.categories), ["Infrastruktur", "Konsultasi", "Pengembangan"]);
  assert.ok(!result.capabilities.includes("Fitur rahasia"));
  assert.ok(!result.technologies.includes("Teknologi rahasia"));
  for (const query of ["SATU data", "investasi", "panduan pengguna", "postgresql api", "24/7"]) {
    assert.ok(
      finder.filterFeaturedCatalog(catalog, { ...defaults, query }).matches.some((item) => item.title === "Aplikasi"),
      query
    );
  }
});

test("category, capability and technology filters compose and expose only relevant dependent choices", () => {
  const catalog = finder.buildFeaturedCatalog(services, []);
  const result = finder.filterFeaturedCatalog(catalog, {
    ...defaults,
    category: "Pengembangan",
    capability: "Integrasi API",
    technology: "PostgreSQL",
  });
  assert.deepEqual(
    Array.from(result.matches, (item) => item.title),
    ["Aplikasi"]
  );
  assert.deepEqual(Array.from(result.capabilities), ["Aplikasi Web", "Integrasi API"]);
  assert.deepEqual(Array.from(result.technologies), ["PostgreSQL", "React"]);
  assert.equal(finder.filterFeaturedCatalog(catalog, { ...defaults, query: "tidak ditemukan" }).matches.length, 0);
});

test("admin edits cannot leave stale categories, capabilities or selected features in the finder", () => {
  const catalog = finder.buildFeaturedCatalog(
    [service("Layanan Baru", "Kategori Baru", ["Fitur Baru"], ["Standar Baru"])],
    []
  );
  const result = finder.filterFeaturedCatalog(catalog, {
    query: "",
    category: "Kategori Lama",
    capability: "Fitur Lama",
    technology: "Standar Lama",
  });
  assert.deepEqual(JSON.parse(JSON.stringify(result.filters)), JSON.parse(JSON.stringify(defaults)));
  assert.equal(result.matches[0].title, "Layanan Baru");
  assert.deepEqual(
    Array.from(finder.selectedCatalogFeatures(catalog[0], ["Fitur Lama", "Fitur Baru", "Fitur Baru"], "")),
    ["Fitur Baru"]
  );
  assert.deepEqual(Array.from(finder.selectedCatalogFeatures(catalog[0], undefined, "Fitur Baru")), ["Fitur Baru"]);
  assert.deepEqual(Array.from(finder.selectedCatalogFeatures(catalog[0], [], "Fitur Baru")), []);
});

// Render with persistent hook state so the same event handlers used in the browser can be exercised.
function mount(input = services) {
  const state = [];
  let cursor = 0;
  const navigation = [];
  const Component = load("components/ui/FeaturedCatalog.tsx", {
    react: {
      useId: () => "finder-test",
      useMemo: (fn) => fn(),
      useState: (initial) => {
        const index = cursor++;
        if (!(index in state)) state[index] = initial;
        return [
          state[index],
          (value) => {
            state[index] = value;
          },
        ];
      },
    },
    "react/jsx-runtime": require("react/jsx-runtime"),
    "lucide-react": require("lucide-react"),
    "next/link": { default: ({ children, ...props }) => React.createElement("a", props, children) },
    "next/navigation": { useRouter: () => ({ push: (href) => navigation.push(href) }) },
    "@/components/ui/ProductPhoto": { default: ({ name }) => React.createElement("span", null, name) },
    "@/components/ui/ServicePhoto": { default: ({ name }) => React.createElement("span", null, name) },
    "@/lib/catalogFinder": finder,
    "@/lib/consultation": consultation,
  }).default;
  let currentInput = input;
  const render = () => {
    cursor = 0;
    return Component({ services: currentInput, products: [], title: "Layanan dari admin" });
  };
  const find = (predicate, node = render()) => {
    if (!node || typeof node !== "object") return undefined;
    if (predicate(node)) return node;
    for (const child of React.Children.toArray(node.props?.children)) {
      const result = find(predicate, child);
      if (result) return result;
    }
  };
  const byId = (suffix) => find((node) => node.props?.id === "finder-test-" + suffix);
  return {
    render,
    find,
    byId,
    navigation,
    changeCatalog: (next) => {
      currentInput = next;
    },
  };
}

test("one form supports filtering, selecting needs and carrying the exact selection into consultation", () => {
  const app = mount();
  assert.equal((renderToStaticMarkup(app.render()).match(/<form/g) || []).length, 1);
  app.byId("category").props.onChange({ target: { value: "Konsultasi" } });
  const html = renderToStaticMarkup(app.render());
  assert.match(html, /data-featured-item="service-Audit"/);
  assert.doesNotMatch(html, /data-featured-item="service-Aplikasi"/);
  app.byId("capability").props.onChange({ target: { value: "Audit Keamanan" } });
  app.byId("purpose").props.onChange({ target: { value: "quotation" } });
  const form = app.find((node) => node.type === "form");
  form.props.onSubmit({ preventDefault() {} });
  const url = new URL(app.navigation[0], "https://example.test");
  assert.equal(url.searchParams.get("service"), "Audit");
  assert.equal(url.searchParams.get("source"), "home");
  assert.equal(url.searchParams.get("purpose"), "quotation");
  assert.deepEqual(url.searchParams.getAll("feature"), ["Audit Keamanan"]);
  assert.equal(url.hash, "#consultation-form");
  assert.equal(url.searchParams.has("catalog-choice"), false);
});

test("no-match search has a usable reset and cannot submit a stale service", () => {
  const app = mount();
  app.byId("query").props.onChange({ target: { value: "tidak ditemukan" } });
  assert.match(renderToStaticMarkup(app.render()), /Belum ada yang sesuai/);
  assert.equal(app.find((node) => node.type === "button" && node.props.type === "submit").props.disabled, true);
  app.find((node) => node.type === "form").props.onSubmit({ preventDefault() {} });
  assert.equal(app.navigation.length, 0);
  app
    .find((node) => node.type === "button" && node.props.children?.some?.((child) => child === "Reset filter"))
    .props.onClick();
  assert.equal(app.byId("query").props.value, "");
  assert.match(renderToStaticMarkup(app.render()), /data-featured-item="service-Aplikasi"/);
  let prevented = false;
  app.byId("query").props.onKeyDown({
    key: "Enter",
    preventDefault() {
      prevented = true;
    },
  });
  assert.equal(prevented, true);
});

test("switching services or receiving a catalog refresh never submits another service's capabilities", () => {
  const app = mount();
  const checkbox = app.find((node) => node.type === "input" && node.props.type === "checkbox");
  checkbox.props.onChange({ target: { checked: true } });
  app
    .find((node) => node.type === "input" && node.props.type === "radio" && node.props.value === "service-Server")
    .props.onChange();
  app.find((node) => node.type === "form").props.onSubmit({ preventDefault() {} });
  assert.equal(new URL(app.navigation.at(-1), "https://example.test").searchParams.getAll("feature").length, 0);
  app.changeCatalog([service("Nouvelle", "Kategori Baru", ["Kemampuan Baru"])]);
  const html = renderToStaticMarkup(app.render());
  assert.match(html, /Nouvelle/);
  assert.doesNotMatch(html, /name="service" value="Server"/);
});
