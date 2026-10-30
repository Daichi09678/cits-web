const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { NextResponse } = require("next/server");
const { load } = require("./helpers/load.cjs");
const config = load("lib/homeSections.ts");
const initial = load("data/initialData.ts");
const http = load("lib/http.ts", { "next/server": { NextResponse } });
const auth = require("./helpers/auth.cjs").createTestAuth("home-test");
const token = (pageAccess) =>
  auth.issueAdminToken({ sub: "staff", email: "staff@example.test", name: "Staff", role: "internal", pageAccess });
const request = (body, credential) =>
  new Request("http://localhost/api/landing/products", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(credential ? { Authorization: `Bearer ${credential}` } : {}) },
    body: JSON.stringify(body),
  });
const context = (page) => ({ params: Promise.resolve({ page }) });
function route(repo) {
  return load("app/api/landing/[page]/route.ts", {
    "next/server": { NextResponse },
    "@/lib/apiAuth": auth,
    "@/lib/homeSections": config,
    "@/lib/http": http,
    "@/lib/db": { DbRepo: repo },
  });
}

test("homepage forms submit only their own sections, preserving explicit empty text and unchecked visibility", () => {
  for (const page of config.HOME_EDITOR_PAGES) {
    const patch = config.homeSectionPatch(page, initial.initialLandingPageData);
    assert.doesNotThrow(() => config.parseHomeSectionPatch(page, patch), page);
  }
  const data = structuredClone(initial.initialLandingPageData);
  data.hero.badgeText = "";
  data.hero.typewriterWords = [" Baru ", "", " "];
  data.sectionVisibility.hero = false;
  const patch = config.homeSectionPatch("about", data);
  assert.equal(patch.hero.badgeText, "");
  assert.deepEqual(Array.from(patch.hero.typewriterWords), ["Baru"]);
  assert.equal(patch.sectionVisibility.hero, false);
  assert.equal(patch.cta.title, data.cta.title); // Homepage settings are centralized on About.
  assert.equal(config.homeSectionPatch("products", data).hero, undefined);
});

test("homepage validation rejects cross-page changes, malformed lists, invalid toggles and unsafe links", () => {
  for (const body of [
    { hero: { badgeText: "Unauthorized" } },
    { productsIntro: { title: {} } },
    { productsIntro: { title: "x".repeat(501) } },
    { productsIntro: { bottomCtaLink: "javascript:alert(1)" } },
    { productsIntro: { bottomCtaLink: "//outside.test" } },
    { productsIntro: { bottomCtaLink: "/\\outside.test" } },
    { sectionVisibility: { products: "false" } },
    { sectionVisibility: { hero: false } },
  ])
    assert.throws(() => config.parseHomeSectionPatch("products", body));
  assert.throws(() => config.parseHomeSectionPatch("about", { hero: { typewriterWords: [3] } }));
  assert.throws(() => config.parseHomeSectionPatch("about", { highlights: [{ label: "Stat", value: 9 }] }));
  assert.doesNotThrow(() =>
    config.parseHomeSectionPatch("products", { productsIntro: { bottomCtaLink: "/products#katalog" } })
  );
});

test("scoped homepage API enforces selected page permissions before storage", async () => {
  const handler = route({ patchLandingData: () => assert.fail("Denied edits must not reach storage") });
  assert.equal((await handler.PATCH(request({}), context("products"))).status, 401);
  assert.equal((await handler.PATCH(request({}, token([])), context("products"))).status, 403);
  assert.equal(
    (await handler.PATCH(request({ cta: { title: "No" } }, token(["products"])), context("products"))).status,
    400
  );
  assert.equal((await handler.PATCH(request({}, token(["products"])), context("invalid"))).status, 400);
});

test("authorized section saves return the server catalog, while database errors return failure", async () => {
  const patch = { productsIntro: { title: "Produk Baru" }, sectionVisibility: { products: false } };
  let received;
  const handler = route({
    patchLandingData: async (data) => {
      received = data;
      return { ...initial.initialLandingPageData, ...data };
    },
  });
  const response = await handler.PATCH(request(patch, token(["products"])), context("products"));
  assert.equal(response.status, 200);
  assert.deepEqual(JSON.parse(JSON.stringify(received)), patch);
  assert.equal((await response.json()).data.sectionVisibility.products, false);
  const failure = route({
    patchLandingData: async () => {
      throw Error("Database offline");
    },
  });
  const failed = await failure.PATCH(request(patch, token(["products"])), context("products"));
  assert.equal(failed.status, 500);
  assert.equal((await failed.json()).success, false);
});

test("failed homepage saves cannot update local cache or emit a success event", async () => {
  const storage = new Map([["landing", JSON.stringify(initial.initialLandingPageData)]]);
  let writes = 0;
  const { CitsStore } = load(
    "stores/citsStore.ts",
    {
      react: {},
      "@/data/initialData": initial,
      "@/config/siteConfig": { siteConfig: { storageKeys: { landing: "landing" } } },
      "@/lib/api": {
        citsApi: {
          updateHomeSection: async () => {
            throw Error("Forbidden");
          },
        },
      },
      "@/lib/actionAccessClient": { assertPageAction: () => {} },
      "@/lib/audio": {},
    },
    {
      window: {
        dispatchEvent: () => {
          writes++;
        },
      },
      localStorage: {
        getItem: (key) => storage.get(key),
        setItem: () => assert.fail("Failed save cannot update cache"),
      },
    }
  );
  await assert.rejects(CitsStore.saveHomeSection("products", { sectionVisibility: { products: false } }), /Forbidden/);
  assert.equal(writes, 0);
});

test("homepage client rejects unsuccessful responses even when they contain data", async () => {
  const { citsApi } = load(
    "lib/api.ts",
    { "./actionAccessClient": { assertPageAction: () => {} } },
    { fetch: async () => ({ ok: false, json: async () => ({ success: false, data: {}, message: "Denied" }) }) }
  );
  await assert.rejects(citsApi.updateHomeSection("products", {}), /Denied/);
});

const wrap = ({ children }) => React.createElement("div", null, children);
const link = ({ href, children, ...props }) => React.createElement("a", { href, ...props }, children);
const photo = ({ name }) => React.createElement("span", null, name);
const catalog = load("lib/serviceCatalog.ts", { "@/data/serviceDetails": load("data/serviceDetails.ts") });
const finder = load("lib/catalogFinder.ts", { "@/lib/serviceCatalog": catalog });
const shared = {
  react: React,
  "react/jsx-runtime": require("react/jsx-runtime"),
  "next/link": { default: link },
  "lucide-react": require("lucide-react"),
  "@/components/ui/ProductPhoto": { default: photo },
  "@/components/ui/ServicePhoto": { default: photo },
  "@/components/ui/SpotlightCard": { default: wrap },
  "@/lib/serviceCatalog": catalog,
  "@/lib/consultation": load("lib/consultation.ts", {}, { URLSearchParams }),
  "@/lib/catalogFinder": finder,
  "next/navigation": { useRouter: () => ({ push() {} }) },
};
const FeaturedCatalog = load("components/ui/FeaturedCatalog.tsx", shared).default;
const HeroMockup = load("components/ui/HeroMockup.tsx", {
  ...shared,
  "framer-motion": { motion: { div: wrap } },
}).default;
const product = (id, showOnHome) => ({
  id,
  name: id,
  description: "Deskripsi",
  category: "Web",
  features: [],
  isActive: true,
  showOnHome,
});
const service = (id, showOnHome) => ({
  id,
  title: id,
  desc: "Layanan",
  icon: "Code2",
  badge: "Pilar",
  sla: "SLA",
  isActive: true,
  showOnHome,
});
const project = (id, showOnHome) => ({
  id,
  title: id,
  client: "Instansi",
  isActive: true,
  showOnHome,
  measurableImpact: { highlightValue: "100%", highlightLabel: "Selesai" },
});

function renderHome(landingData, overrides = {}) {
  const Home = load("app/(public)/page.tsx", {
    ...shared,
    "@/data/initialData": initial,
    "@/stores/citsStore": {
      useCitsStore: () => ({
        landingData,
        clients: [
          { id: "visible-client", name: "Mitra terpilih", isActive: true },
          { id: "hidden-client", name: "Mitra tersembunyi", isActive: true, showOnHome: false },
        ],
        services: [service("layanan-terpilih", true), service("layanan-tersembunyi", false)],
        activeProducts: [product("produk-terpilih", true), product("produk-tersembunyi", false)],
        activeCaseStudies: [project("proyek-terpilih", true), project("proyek-tersembunyi", false)],
        ...overrides,
      }),
    },
    "@/components/animations/ScrollReveal": { default: wrap },
    "@/components/animations/Counter": { default: ({ value }) => React.createElement("span", null, value) },
    "@/components/animations/ParticleNetwork": { default: () => null },
    "@/components/animations/FloatingShapes": { default: () => null },
    "@/components/animations/TypewriterText": {
      default: ({ words }) => React.createElement("span", null, words.join(" | ")),
    },
    "@/components/ui/HeroMockup": { default: HeroMockup },
    "@/components/ui/GridPattern": { default: () => null },
    "@/components/ui/GradientText": { default: wrap },
    "@/components/ui/FeaturedCatalog": { default: FeaturedCatalog },
    "@/components/ui/AboutHomeHighlights": { default: () => null },
    "@/lib/publicPageContentClient": { usePublicPageContent: () => ({ content: {} }) },
    "@/components/ui/Marquee": {
      default: ({ items }) => React.createElement("div", null, items.map((item) => item.name).join(", ")),
    },
  }).default;
  return renderToStaticMarkup(React.createElement(Home));
}

test("public homepage displays edited hero, introduction and CTA text and only checked catalog items", () => {
  const data = structuredClone(initial.initialLandingPageData);
  data.hero.headlinePrefix = "Judul baru admin";
  data.productsIntro.title = "Katalog pilihan admin";
  data.servicesIntro.badge = "Label layanan admin";
  data.cta.title = "Hubungi tim kami";
  data.cta.primaryText = "Jadwalkan diskusi";
  const html = renderHome(data);
  for (const text of [
    "Judul baru admin",
    "Katalog pilihan admin",
    "Hubungi tim kami",
    "Jadwalkan diskusi",
    "produk-terpilih",
    "layanan-terpilih",
    "proyek-terpilih",
    "Mitra terpilih",
  ])
    assert.ok(html.includes(text), text);
  // Tag/label pil di atas judul section sudah dihapus dari beranda.
  for (const text of ["Label layanan admin", initial.initialLandingPageData.hero.badgeText, "Solusi Skala Nasional"])
    assert.ok(!html.includes(text), text);
  for (const text of ["produk-tersembunyi", "layanan-tersembunyi", "proyek-tersembunyi", "Mitra tersembunyi"])
    assert.ok(!html.includes(text), text);
});

test("unchecked homepage sections and deliberately empty text never restore hardcoded defaults", () => {
  const data = structuredClone(initial.initialLandingPageData);
  data.sectionVisibility = {
    hero: false,
    highlights: false,
    products: false,
    services: false,
    clients: false,
    cta: false,
  };
  assert.equal(renderHome(data), "");
  data.sectionVisibility.hero = true;
  data.hero.badgeText = "";
  data.hero.headlinePrefix = "";
  data.hero.typewriterWords = [];
  data.hero.showMockup = false;
  const html = renderHome(data);
  assert.doesNotMatch(html, /Penyedia Solusi|Ciptakan Solusi|Sepenuh Hati/);
  data.sectionVisibility.clients = true;
  assert.doesNotMatch(renderHome(data, { clients: [] }), /Kementerian|Mitra terpilih/);
});

test("all selected products appear on the homepage, including selections after the fifth item", () => {
  const products = Array.from({ length: 7 }, (_, index) => product(`pilihan-${index + 1}`, true));
  const html = renderHome(initial.initialLandingPageData, { activeProducts: products });
  for (const item of products) assert.ok(html.includes(`data-product-id="${item.id}"`));
});

test("database failures preserve the last saved homepage data", async () => {
  const memory = { landingData: structuredClone(initial.initialLandingPageData) };
  const sql = Object.assign(
    async () => {
      throw Error("Database offline");
    },
    { json: (value) => value }
  );
  const { DbRepo } = load(
    "lib/db.ts",
    {
      postgres: { default: () => sql },
      "@/data/initialData": initial,
      "@/config/inbox": {},
    },
    {
      _citsMemoryDb: memory,
      _citsDbInitialized: true,
      _citsDbSchemaVersion: 5,
      process: { env: { DATABASE_URL: "postgres://localhost/test" } },
    }
  );
  await assert.rejects(DbRepo.patchLandingData({ hero: { headlinePrefix: "Not saved" } }), /Database offline/);
  assert.equal(memory.landingData.hero.headlinePrefix, initial.initialLandingPageData.hero.headlinePrefix);
});
