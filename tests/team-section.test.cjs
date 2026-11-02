const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { load } = require("./helpers/load.cjs");

const Card = load("components/ui/TeamMemberCard.tsx", {
  "react/jsx-runtime": require("react/jsx-runtime"),
  "next/image": { default: ({ fill: _fill, ...props }) => React.createElement("img", props) },
}).default;
const Section = load("components/ui/TeamSection.tsx", {
  "react/jsx-runtime": require("react/jsx-runtime"),
  "next/link": { default: (props) => React.createElement("a", props) },
  "lucide-react": { ArrowRight: () => null },
  "./TeamMemberCard": { default: Card },
}).default;

test("team preview uses only eligible members, sorts without mutating data, and limits the result to four", () => {
  const members = [6, 5, 4, 3, 2, 1].map((order) => ({
    id: `test-${order}`,
    name: `Anggota Uji ${order}`,
    position: "Jabatan untuk pengujian",
    photoUrl: null,
    displayOrder: order,
    isActive: order !== 1,
    showOnHomepage: order !== 2,
  }));
  members.push({ id: "unsorted", name: "Anggota Uji Tanpa Urutan", position: "Uji", photoUrl: null });
  const before = structuredClone(members);
  const html = renderToStaticMarkup(React.createElement(Section, { members }));
  assert.deepEqual(members, before);
  assert.equal((html.match(/<article/g) || []).length, 4);
  for (const order of [3, 4, 5, 6]) assert.ok(html.includes(`Anggota Uji ${order}`));
  for (const name of ["Anggota Uji 1", "Anggota Uji 2", "Anggota Uji Tanpa Urutan"]) assert.ok(!html.includes(name));
  assert.ok(html.indexOf("Anggota Uji 3") < html.indexOf("Anggota Uji 4"));
  const optionalFlags = renderToStaticMarkup(React.createElement(Section, { members: [members.at(-1)] }));
  assert.ok(optionalFlags.includes("Anggota Uji Tanpa Urutan"));
});

test("team section never invents identities, and missing photos use a plain placeholder", () => {
  const empty = renderToStaticMarkup(React.createElement(Section));
  assert.match(empty, /id="team"/);
  assert.match(empty, /href="\/#team"/);
  assert.match(empty, /Informasi anggota tim belum tersedia/);
  assert.doesNotMatch(empty, /<article|<img/);
  const hidden = renderToStaticMarkup(
    React.createElement(Section, { members: [{ id: "hidden", name: "Tidak Ditampilkan", isActive: false }] })
  );
  assert.doesNotMatch(hidden, /Tidak Ditampilkan/);
  const noPhoto = renderToStaticMarkup(
    React.createElement(Card, { member: { id: "test", name: "Nama Uji", position: "Jabatan Uji", photoUrl: null } })
  );
  assert.match(noPhoto, /Foto belum tersedia/);
  assert.doesNotMatch(noPhoto, /<img/);
  const withPhoto = renderToStaticMarkup(
    React.createElement(Card, {
      member: { id: "test", name: "Nama Uji", position: "Jabatan Uji", photoUrl: "/test-photo.webp" },
    })
  );
  assert.match(withPhoto, /alt="Foto Nama Uji"/);
  assert.match(withPhoto, /object-cover object-top/);
});
