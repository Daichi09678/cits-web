const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { load } = require("./helpers/load.cjs");

const Profile = load("components/pages/team/TeamProfileDialog.tsx", {
  react: React,
  "react/jsx-runtime": require("react/jsx-runtime"),
  "next/image": {
    default: ({ fill: _fill, unoptimized: _unoptimized, ...props }) => React.createElement("img", props),
  },
  "lucide-react": { UserRound: () => null, X: () => null },
}).default;

const member = { id: "member-1", name: "Rina", position: "Lead Engineer", teamName: "Platform", photoUrl: null };
const render = (patch = {}) =>
  renderToStaticMarkup(React.createElement(Profile, { member: { ...member, ...patch }, onClose() {} }));

test("public profile uses the selected member's saved identity, team and description and escapes text", () => {
  const html = render({ description: "Pengembangan platform.\n\n<script>alert('x')</script>" });
  assert.match(html, /<dialog[^>]*aria-labelledby=/);
  assert.match(html, /aria-describedby=/);
  assert.match(html, />Rina<\/h2>/);
  assert.match(html, /Lead Engineer/);
  assert.match(html, /Tim: Platform/);
  assert.match(html, /Pengembangan platform\.\n\n&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /Tutup detail profil/);
});

test("legacy profiles have honest empty descriptions, while sample identities stay labelled", () => {
  assert.match(render(), /Deskripsi anggota ini belum tersedia/);
  assert.match(render({ description: "  " }), /Deskripsi anggota ini belum tersedia/);
  assert.match(render({ teamName: "" }), /Tim: Belum ditentukan/);
  assert.match(render({ isDemo: true }), /bukan profil anggota resmi/);
  assert.doesNotMatch(render(), /bukan profil anggota resmi/);
});
