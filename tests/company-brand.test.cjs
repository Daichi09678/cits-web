const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { load } = require("./helpers/load.cjs");
const definitions = load("data/publicPageContent.ts");
const contentLib = load("lib/publicPageContent.ts", { "@/data/publicPageContent": definitions });

function renderBrand(texts) {
  let subscriptions = 0;
  const content = contentLib.resolvePublicPageContent("about", { texts });
  const { default: Provider, CompanyLogo } = load("components/layout/CompanyBrand.tsx", {
    react: React,
    "react/jsx-runtime": require("react/jsx-runtime"),
    "next/image": {
      default: ({ fill: _fill, unoptimized: _unoptimized, priority: _priority, ...props }) =>
        React.createElement("img", props),
    },
    "@/lib/publicPageContent": contentLib,
    "@/lib/publicPageContentClient": {
      usePublicPageContent: (page) => {
        assert.equal(page, "about");
        subscriptions++;
        return { content };
      },
    },
  });
  const html = renderToStaticMarkup(
    React.createElement(
      Provider,
      null,
      React.createElement(CompanyLogo, { location: "navbar" }),
      React.createElement(CompanyLogo, { location: "footer" })
    )
  );
  return { html, subscriptions };
}

test("public navbar and footer share saved theme-specific logos and alternate text with one subscription", () => {
  const { html, subscriptions } = renderBrand({
    about_hero_src_5: "/uploads/new-light.png",
    about_hero_alt_6: "Identitas terang baru",
    about_hero_src_7: "/uploads/new-dark.png",
    about_hero_alt_8: "Identitas gelap baru",
  });
  assert.equal(subscriptions, 1);
  for (const text of [
    "/uploads/new-light.png",
    "/uploads/new-dark.png",
    "Identitas terang baru",
    "Identitas gelap baru",
  ])
    assert.equal(html.split(`${text.startsWith("/") ? "src" : "alt"}="${text}"`).length - 1, 2, text);
  assert.doesNotMatch(html, /src="\/logo(?:-dark)?\.webp"/);
  assert.match(html, /dark:hidden/);
  assert.match(html, /dark:block/);
});

test("saved uploaded logos and explicit removal never revert to bundled files", () => {
  const removed = load("lib/aboutEditor.ts", { "./publicPageContent": contentLib }).EMPTY_ABOUT_LOGO;
  for (const image of ["data:image/png;base64,aGVsbG8=", removed]) {
    const { html } = renderBrand({ about_hero_src_5: image, about_hero_src_7: image });
    assert.equal(html.split(image).length - 1, 4);
    assert.doesNotMatch(html, /src="\/logo/);
  }
});
