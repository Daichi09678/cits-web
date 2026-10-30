const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { load } = require("./helpers/load.cjs");

const definitions = load("data/publicPageContent.ts");
const content = load("lib/publicPageContent.ts", { "@/data/publicPageContent": definitions });
const Component = load("components/ui/AboutHomeHighlights.tsx", {
  react: React,
  "react/jsx-runtime": require("react/jsx-runtime"),
  "next/link": { default: ({ children, href, ...props }) => React.createElement("a", { href, ...props }, children) },
  "lucide-react": require("lucide-react"),
  "@/lib/publicPageContent": content,
}).default;

const render = (data) => renderToStaticMarkup(React.createElement(Component, { content: data }));
const escapeHtml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

test("ringkasan tentang kami tidak dirender saat belum ada section yang dipilih untuk beranda", () => {
  const data = content.resolvePublicPageContent("about");
  assert.equal(render(data), "");
});

test("hanya section yang dicentang untuk beranda yang tampil, mengikuti urutan tersimpan", () => {
  const data = content.resolvePublicPageContent("about");
  const keys = data.order;
  data.homeVisibility[keys[1]] = true;
  data.homeVisibility[keys[0]] = true;

  const html = render(data);
  assert.match(html, /Mengenal CITS Indonesia/);
  assert.match(html, /Selengkapnya tentang kami/);

  // urutan mengikuti data.order (keys[0] lebih dulu dari keys[1])
  const first = html.indexOf(escapeHtml(definitions.publicPageDefinitions.about.sections[0].title));
  const second = html.indexOf(escapeHtml(definitions.publicPageDefinitions.about.sections[1].title));
  assert.ok(first >= 0 && second >= 0 && first < second, "urutan section harus mengikuti data.order");

  // section yang disembunyikan dari halaman Tentang Kami tidak ikut tampil di beranda
  data.visibility[keys[0]] = false;
  const hidden = render(data);
  assert.ok(!hidden.includes(escapeHtml(definitions.publicPageDefinitions.about.sections[0].title)));
  assert.ok(hidden.includes(escapeHtml(definitions.publicPageDefinitions.about.sections[1].title)));
});

test("urutan section yang diubah admin dipakai di beranda", () => {
  const data = content.resolvePublicPageContent("about");
  const keys = data.order;
  data.homeVisibility[keys[0]] = true;
  data.homeVisibility[keys[1]] = true;
  const reversed = [...data.order].reverse();
  data.order = reversed;
  const html = render(data);
  const first = html.indexOf(escapeHtml(definitions.publicPageDefinitions.about.sections[1].title));
  const second = html.indexOf(escapeHtml(definitions.publicPageDefinitions.about.sections[0].title));
  assert.ok(first >= 0 && second >= 0 && first < second);
});
