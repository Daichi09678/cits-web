const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { load } = require("./helpers/load.cjs");
const contentLib = load("lib/publicPageContent.ts", { "@/data/publicPageContent": load("data/publicPageContent.ts") });
const runtime = { "react/jsx-runtime": require("react/jsx-runtime"), "lucide-react": require("lucide-react") };
const Fields = load("components/pages/admin-portfolio/PortfolioSectionFields.tsx", {
  ...runtime,
  "@/lib/publicPageContent": contentLib,
}).default;

function find(predicate, node) {
  if (!node || typeof node !== "object") return undefined;
  if (predicate(node)) return node;
  for (const child of React.Children.toArray(node.props?.children)) {
    const match = find(predicate, child);
    if (match) return match;
  }
}

function mount({ canEdit = true, fail = false, studyFail = false, studies = [] } = {}) {
  const states = [];
  let cursor = 0;
  let content = structuredClone(contentLib.resolvePublicPageContent("portfolio"));
  const requests = [];
  const studyRequests = [];
  const editorModule = load(
    "components/pages/admin-portfolio/PortfolioEditor.tsx",
    {
      ...runtime,
      react: {
        useState: (initial) => {
          const index = cursor++;
          if (!(index in states)) states[index] = initial;
          return [
            states[index],
            (next) => {
              states[index] = next;
            },
          ];
        },
        useRef: (initial) => {
          const index = cursor++;
          if (!(index in states)) states[index] = { current: initial };
          return states[index];
        },
      },
      "@/lib/auth": { useAdminAuth: () => ({ session: { user: {} } }) },
      "@/lib/internalAccess": { canPerformAction: () => canEdit },
      "@/lib/publicPageContentClient": {
        usePublicPageContent: () => ({
          content,
          loading: false,
          loadError: "",
          save: async (data) => {
            requests.push(structuredClone(data));
            if (fail) throw new Error("Neon unavailable");
            content = data;
          },
        }),
      },
      "@/lib/publicPageContent": contentLib,
      "./PortfolioSectionFields": { default: Fields },
    },
    { window: { matchMedia: () => ({ matches: false }) }, Error }
  );
  const render = () => {
    cursor = 0;
    return editorModule.default({
      studies,
      onSaveStudies: async (next) => {
        studyRequests.push(structuredClone(next));
        if (studyFail) throw new Error("Proyek gagal disimpan");
        studies = next;
      },
      children: React.createElement(
        "section",
        { "data-testid": "study-manager" },
        "Total Penugasan dan daftar studi kasus"
      ),
    });
  };
  const query = (predicate) => find(predicate, render());
  return {
    render,
    query,
    requests,
    studyRequests,
    sections: editorModule.portfolioEditorSections,
    fields: () => query((node) => node.type === Fields)?.props,
    select: (key) => {
      const section = editorModule.portfolioEditorSections.find((item) => item.key === key);
      query(
        (node) =>
          node.type === "button" &&
          node.props["aria-controls"] &&
          React.Children.toArray(node.props.children).some((child) => child.props?.children === section.title)
      ).props.onClick();
    },
    submit: () => query((node) => node.type === "form").props.onSubmit({ preventDefault() {} }),
    retry: () => {
      fail = false;
      studyFail = false;
    },
  };
}

test("portfolio navigation exposes six content sections plus a separate study management section", () => {
  const app = mount();
  assert.equal(app.sections.length, 7);
  assert.equal(new Set(app.sections.map((item) => item.key)).size, 7);
  assert.deepEqual(
    Array.from(app.sections, (item) => item.key).filter((key) => key !== "portfolio-study-management"),
    Array.from(contentLib.sectionKeys("portfolio"))
  );
  assert.doesNotMatch(renderToStaticMarkup(app.render()), /data-testid="study-manager"/);
  app.select("portfolio-study-management");
  const html = renderToStaticMarkup(app.render());
  assert.match(html, /data-testid="study-manager"/);
  assert.match(html, /Total Penugasan dan daftar studi kasus/);
  assert.equal(
    app.query((node) => node.type === "form"),
    undefined,
    "management must not be nested in the content form"
  );
  assert.equal(app.requests.length, 0);
});

test("switching all seven sections preserves unsaved edits and saves content without adding an admin-only section", async () => {
  const app = mount();
  const original = app.fields().data;
  app.fields().onChange({ ...original, texts: { ...original.texts, portfolio_hero_text_2: "Judul Portofolio Baru" } });
  for (const section of app.sections) app.select(section.key);
  app.select("portfolio-hero-heading");
  assert.equal(app.fields().data.texts.portfolio_hero_text_2, "Judul Portofolio Baru");
  assert.equal(app.requests.length, 0);
  await app.submit();
  assert.equal(app.requests.length, 1);
  assert.equal(app.requests[0].texts.portfolio_hero_text_2, "Judul Portofolio Baru");
  assert.equal("portfolio-study-management" in app.requests[0].visibility, false);
  assert.match(renderToStaticMarkup(app.render()), /berhasil disimpan/);
});

test("a failed content save preserves the draft for retry and visibility changes stay section-scoped", async () => {
  const app = mount({ fail: true });
  app.select("testimonials-heading");
  app
    .query((node) => node.type === "input" && node.props.type === "checkbox")
    .props.onChange({ target: { checked: false } });
  await app.submit();
  assert.match(renderToStaticMarkup(app.render()), /Neon unavailable/);
  assert.equal(app.fields().data.visibility["testimonials-heading"], false);
  assert.equal(app.fields().data.visibility["flagship-heading"], true);
  app.retry();
  await app.submit();
  assert.equal(app.requests.length, 2);
  assert.equal(app.requests[1].visibility["testimonials-heading"], false);
});

test("read-only portfolio access can navigate but cannot save content", async () => {
  const app = mount({ canEdit: false });
  app.select("metrics-heading");
  assert.equal(app.query((node) => node.type === "fieldset").props.disabled, true);
  await app.submit();
  assert.equal(app.requests.length, 0);
});

test("flagship selection saves only changed project flags and remains available across sections", async () => {
  const studies = [
    { id: "a", title: "Proyek A", isFlagship: false, client: "Klien A" },
    { id: "b", title: "Proyek B", isFlagship: true, client: "Klien B" },
  ];
  const app = mount({ studies });
  app.select("flagship-heading");
  app
    .query((node) => node.props?.["aria-label"] === "Jadikan Proyek A proyek unggulan")
    .props.onChange({ target: { checked: true } });
  app.select("portfolio-study-management");
  app.select("flagship-heading");
  assert.equal(
    app.query((node) => node.props?.["aria-label"] === "Jadikan Proyek A proyek unggulan").props.checked,
    true
  );
  await app.submit();
  assert.equal(app.requests.length, 0);
  assert.deepEqual(app.studyRequests[0], [{ ...studies[0], isFlagship: true }, studies[1]]);
});

test("a partial flagship save reports confirmed text changes and retries only unsaved project selection", async () => {
  const app = mount({ studyFail: true, studies: [{ id: "a", title: "Proyek A", isFlagship: false }] });
  app.select("flagship-heading");
  const data = app.fields().data;
  app.fields().onChange({ ...data, texts: { ...data.texts, flagship_text_2: "Sorotan Baru" } });
  app
    .query((node) => node.props?.["aria-label"] === "Jadikan Proyek A proyek unggulan")
    .props.onChange({ target: { checked: true } });
  await app.submit();
  assert.match(
    renderToStaticMarkup(app.render()),
    /Teks halaman sudah tersimpan, tetapi pilihan proyek unggulan belum tersimpan/
  );
  app.retry();
  await app.submit();
  assert.equal(app.requests.length, 1);
  assert.equal(app.studyRequests.length, 2);
  assert.equal(app.studyRequests[1][0].isFlagship, true);
});

test("portfolio metrics and testimonials support adding, editing, reordering and removing saved-shaped rows", () => {
  for (const [key, schema] of Object.entries(contentLib.pageDefinition("portfolio").collections)) {
    let data = structuredClone(contentLib.resolvePublicPageContent("portfolio"));
    data.collections[key] = [];
    const render = () =>
      Fields({
        sectionKey: schema.section,
        data,
        onChange: (next) => {
          data = next;
        },
      });
    const query = (predicate) => find(predicate, render());
    const add = () =>
      query(
        (node) => node.type === "button" && React.Children.toArray(node.props.children).join("").includes("Tambah")
      ).props.onClick();
    add();
    const field = Object.keys(schema.items[0])[0];
    query((node) => node.props?.id === `portfolio-${key}-0-${field}`).props.onChange({
      target: { value: "Item pertama" },
    });
    add();
    query((node) => node.props?.id === `portfolio-${key}-1-${field}`).props.onChange({
      target: { value: "Item kedua" },
    });
    query((node) => node.props?.["aria-label"] === "Pindahkan item 2 ke atas").props.onClick();
    assert.equal(data.collections[key][0][field], "Item kedua");
    query((node) => node.props?.["aria-label"] === "Hapus item 1").props.onClick();
    assert.equal(data.collections[key][0][field], "Item pertama");
    query((node) => node.props?.["aria-label"] === "Hapus item 1").props.onClick();
    assert.equal(data.collections[key].length, 0);
    assert.doesNotThrow(() => contentLib.parsePublicPageContent("portfolio", data));
  }
});
