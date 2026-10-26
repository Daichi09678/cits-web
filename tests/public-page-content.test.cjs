const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { NextResponse } = require("next/server");
const { load } = require("./helpers/load.cjs");

const definitions = load("data/publicPageContent.ts");
const contentLib = load("lib/publicPageContent.ts", { "@/data/publicPageContent": definitions });
const initial = load("data/initialData.ts");
const clone = (value) => structuredClone(value);
const fullContent = (page) => clone(contentLib.resolvePublicPageContent(page));
const runtime = {
  react: React,
  "react/jsx-runtime": require("react/jsx-runtime"),
  "lucide-react": require("lucide-react"),
};
const wrap = ({ children }) => React.createElement("div", null, children);
const empty = () => null;

function renderPage(page, content, study = null) {
  const Component = load(`app/(public)/${page}/page.tsx`, {
    ...runtime,
    react: study ? { ...React, useState: (initial) => [initial === null ? study : initial, () => {}] } : React,
    "next/link": { default: ({ children, href, ...props }) => React.createElement("a", { href, ...props }, children) },
    "next/image": { default: ({ src, alt }) => React.createElement("img", { src, alt }) },
    "framer-motion": { motion: { div: wrap }, AnimatePresence: wrap },
    "@/lib/consultation": { consultationHref: () => "/contact#consultation-form" },
    "@/components/ui/useModalFocus": { useModalFocus: () => ({ current: null }) },
    "@/components/animations/ScrollReveal": { default: wrap },
    "@/components/ui/GradientText": { default: ({ children }) => React.createElement("span", null, children) },
    "@/components/ui/GridPattern": { default: empty },
    "@/components/animations/FloatingShapes": { default: empty },
    "@/components/ui/SpotlightCard": { default: wrap },
    "@/components/ui/TestimonialSlider": {
      default: ({ testimonials }) =>
        React.createElement("div", null, testimonials.map((item) => item.quote).join(" | ")),
    },
    "@/stores/citsStore": {
      useCitsStore: () => ({ aboutData: initial.initialAboutData, caseStudies: initial.initialCaseStudies }),
    },
    "@/lib/publicPageContentClient": { usePublicPageContent: () => ({ content }) },
    "@/lib/publicPageContent": contentLib,
  }).default;
  return renderToStaticMarkup(React.createElement(Component));
}
function editText(page, content, original, next) {
  const key = Object.keys(content.texts).find((key) => content.texts[key] === original);
  assert.ok(key, `Expected editable ${page} text: ${original}`);
  content.texts[key] = next;
  return key;
}

test("every About and Portfolio section has editable fields and all list editors are assigned to a visible section", () => {
  for (const page of ["about", "portfolio"]) {
    const definition = contentLib.pageDefinition(page);
    assert.doesNotThrow(() => contentLib.parsePublicPageContent(page, fullContent(page)));
    for (const list of Object.values(definition.collections))
      assert.ok(
        definition.sections.some((section) => section.key === list.section),
        list.title
      );
    for (const section of definition.sections) assert.ok(section.fields.length > 0);
  }
});

test("About displays edited badges, logo, legal status, history, governance and final partnership text", () => {
  const data = fullContent("about");
  editText("about", data, "Kepatuhan SPBE & Keamanan Siber", "Standar keamanan baru");
  editText("about", data, "Legalitas Resmi", "Legalitas terverifikasi");
  editText("about", data, "Cipta Integrasi Teknologi Solusi", "Nama perusahaan baru");
  editText("about", data, "Siap Bermitra Membangun Solusi TI Bersama CITS Indonesia?", "Mari membangun bersama");
  editText("about", data, "Hubungi Tim Ahli Kami", "Jadwalkan pertemuan");
  editText("about", data, "Kantor Operasional & Representasi Resmi", "Kantor baru kami");
  data.collections.values[0].word = "Prinsip baru";
  data.collections.milestones = [
    {
      year: "2026",
      category: "Tahap baru",
      scope: "Nasional",
      title: "Riwayat yang diperbarui",
      description: "Deskripsi sejarah baru",
    },
  ];
  data.collections.governancePillars[0].items = ["Poin legalitas baru"];
  const html = renderPage("about", data);
  for (const text of [
    "Standar keamanan baru",
    "Legalitas terverifikasi",
    "Nama perusahaan baru",
    "Mari membangun bersama",
    "Jadwalkan pertemuan",
    "Kantor baru kami",
    "Prinsip baru",
    "Riwayat yang diperbarui",
    "Poin legalitas baru",
  ])
    assert.ok(html.includes(text), text);
  assert.doesNotMatch(html, /Pendirian CV CITS Indonesia/);
});

test("Portfolio displays edited introduction, impact metrics, testimonials and bottom consultation text", () => {
  const data = fullContent("portfolio");
  editText("portfolio", data, "Rekam Jejak Kemitraan & Studi Kasus Enterprise", "Portofolio pilihan kami");
  editText(
    "portfolio",
    data,
    "Siap Mengembangkan Solusi Teknologi Informasi untuk Instansi Anda?",
    "Rencanakan proyek berikutnya"
  );
  editText("portfolio", data, "Konsultasikan Kebutuhan Proyek", "Bicarakan kebutuhan Anda");
  data.collections.impactMetrics = [{ value: "200+", label: "Capaian baru", description: "Dampak baru" }];
  data.collections.testimonials = [{ quote: "Testimoni diperbarui", name: "Direktur", company: "Mitra baru" }];
  const html = renderPage("portfolio", data);
  for (const text of [
    "Portofolio pilihan kami",
    "Rencanakan proyek berikutnya",
    "Bicarakan kebutuhan Anda",
    "Capaian baru",
    "Dampak baru",
    "Testimoni diperbarui",
  ])
    assert.ok(html.includes(text), text);
  const study = { ...clone(initial.initialCaseStudies[0]), deliverables: ["Hasil proyek dari admin"] };
  assert.match(renderPage("portfolio", data, study), /Hasil proyek dari admin/);
});

test("cleared content and unchecked sections do not resurrect defaults or crash empty lists", () => {
  for (const page of ["about", "portfolio"]) {
    const data = fullContent(page);
    data.visibility = Object.fromEntries(Object.keys(data.visibility).map((key) => [key, false]));
    assert.doesNotMatch(renderPage(page, data), /<section/);
    const emptyLists = fullContent(page);
    emptyLists.collections = Object.fromEntries(Object.keys(emptyLists.collections).map((key) => [key, []]));
    assert.doesNotThrow(() => renderPage(page, emptyLists));
  }
  const data = fullContent("about");
  const key = editText("about", data, "Kolaborasi Solusi Digital Terpadu", "");
  assert.equal(contentLib.parsePublicPageContent("about", data).texts[key], "");
  assert.doesNotMatch(renderPage("about", data), /Kolaborasi Solusi Digital Terpadu/);
});

test("content validation rejects unsafe links, invalid lists, duplicate IDs and cross-page content", () => {
  const data = fullContent("about");
  const linkKey = contentLib
    .pageDefinition("about")
    .sections.flatMap((section) => section.fields)
    .find((field) => field.kind === "link").key;
  for (const badLink of ["javascript:alert(1)", "//outside.test", "/\\outside.test"]) {
    const invalid = clone(data);
    invalid.texts[linkKey] = badLink;
    assert.throws(() => contentLib.parsePublicPageContent("about", invalid));
  }
  const duplicate = clone(data);
  duplicate.collections.awards[1].id = duplicate.collections.awards[0].id;
  assert.throws(() => contentLib.parsePublicPageContent("about", duplicate));
  const malformed = clone(data);
  malformed.collections.governancePillars[0].items = [{}];
  assert.throws(() => contentLib.parsePublicPageContent("about", malformed));
  assert.throws(() => contentLib.parsePublicPageContent("portfolio", data));
});

const auth = load(
  "lib/apiAuth.ts",
  { "next/server": { NextResponse } },
  { Buffer, process: { env: { ADMIN_AUTH_SECRET: "page-content-tests" } } }
);
const http = load("lib/http.ts", { "next/server": { NextResponse } });
const credential = (pageAccess) =>
  auth.issueAdminToken({ sub: "staff", email: "staff@example.test", name: "Staff", role: "internal", pageAccess });
const request = (data, token) =>
  new Request("http://localhost/api/page-content/about", {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(data),
  });
const context = (page) => ({ params: Promise.resolve({ page }) });
function routes(repo) {
  return load("app/api/page-content/[page]/route.ts", {
    "next/server": { NextResponse },
    "@/lib/apiAuth": auth,
    "@/lib/http": http,
    "@/lib/publicPageContent": contentLib,
    "@/lib/db": { DbRepo: repo },
  });
}

test("page content API requires the corresponding page permission and returns defaults before the first save", async () => {
  const route = routes({
    updatePublicPageContent: () => assert.fail("Unauthorized save"),
    getPublicPageContent: async () => null,
  });
  assert.equal((await route.PUT(request(fullContent("about")), context("about"))).status, 401);
  assert.equal(
    (await route.PUT(request(fullContent("about"), credential(["portfolio"])), context("about"))).status,
    403
  );
  const response = await route.GET(new Request("http://localhost/test"), context("portfolio"));
  assert.equal(response.status, 200);
  assert.ok(Object.keys((await response.json()).data.texts).length > 0);
});

test("authorized content round-trips through the API and database failures cannot report success", async () => {
  let stored;
  const route = routes({
    updatePublicPageContent: async (page, data) => {
      stored = { page, data };
      return data;
    },
  });
  const data = fullContent("portfolio");
  data.collections.testimonials = [];
  const response = await route.PUT(request(data, credential(["portfolio"])), context("portfolio"));
  assert.equal(response.status, 200);
  assert.equal(stored.page, "portfolio");
  assert.deepEqual((await response.json()).data.collections.testimonials, []);
  const failed = routes({
    updatePublicPageContent: async () => {
      throw Error("Database offline");
    },
  });
  const failure = await failed.PUT(request(data, credential(["portfolio"])), context("portfolio"));
  assert.equal(failure.status, 500);
  assert.equal((await failure.json()).success, false);
});

test("a stale page fetch cannot overwrite a confirmed edit, even if browser storage cannot be written", async () => {
  const states = [],
    effects = [],
    handlers = new Map();
  let finishFetch;
  const pending = new Promise((resolve) => {
    finishFetch = resolve;
  });
  const updated = fullContent("about");
  updated.collections.awards = [];
  class CustomEventMock {
    constructor(type, options) {
      this.type = type;
      this.detail = options.detail;
    }
  }
  const hook = load(
    "lib/publicPageContentClient.ts",
    {
      react: {
        useState: (initial) => {
          const index = states.length;
          states.push(typeof initial === "function" ? initial() : initial);
          return [
            states[index],
            (next) => {
              states[index] = next;
            },
          ];
        },
        useEffect: (effect) => effects.push(effect),
      },
      "@/lib/publicPageContent": contentLib,
      "@/lib/api": { citsApi: { getPublicPageContent: () => pending, updatePublicPageContent: async () => updated } },
    },
    {
      window: {
        addEventListener: (type, listener) => handlers.set(type, listener),
        removeEventListener: () => {},
        dispatchEvent: (event) => handlers.get(event.type)?.(event),
      },
      localStorage: {
        getItem: () => null,
        setItem: () => {
          throw Error("Storage disabled");
        },
      },
      CustomEvent: CustomEventMock,
      StorageEvent: class {},
    }
  );
  const { save } = hook.usePublicPageContent("about");
  effects[0]();
  await save(updated);
  finishFetch(fullContent("about"));
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(states[0].collections.awards.length, 0);
});
