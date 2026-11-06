const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { load } = require("./helpers/load.cjs");
const directory = load("lib/teamDirectory.ts", { "@/lib/team": load("lib/team.ts") });
const members = [
  { id: "2", name: "Rina", position: "Project Manager", displayOrder: 2, photoUrl: null },
  { id: "1", name: "Andi", position: "Engineer", displayOrder: 1, photoUrl: null },
  { id: "3", name: "Internal", position: "Engineer", isActive: false, photoUrl: null },
  { id: "4", name: "Private", position: "Private role", showOnHomepage: false, photoUrl: null },
];

test("team directory combines name and role search with published status and saved order", () => {
  const original = structuredClone(members);
  assert.deepEqual(
    Array.from(directory.publicTeamMembers(members), (member) => member.id),
    ["1", "2"]
  );
  assert.deepEqual(
    Array.from(directory.searchTeamMembers(members, " RINA "), (member) => member.id),
    ["2"]
  );
  assert.deepEqual(
    Array.from(directory.searchTeamMembers(members, "ENGINEER", "Engineer"), (member) => member.id),
    ["1"]
  );
  assert.equal(directory.searchTeamMembers(members, "Rina", "Engineer").length, 0);
  assert.equal(directory.searchTeamMembers(members, "Private").length, 0);
  assert.deepEqual(members, original);
});

test("sample roster contains four distinct teams with six members and one homepage lead each", () => {
  const examples = load("data/teamMembers.ts").demoTeamMembers;
  const grouped = directory.groupTeamMembers(examples);
  assert.equal(examples.length, 24);
  assert.equal(new Set(examples.map((member) => member.id)).size, 24);
  assert.equal(grouped.length, 4);
  for (const group of grouped) {
    assert.equal(group.members.length, 6);
    assert.ok(group.members.every((member) => member.isDemo && member.teamName === group.name));
    assert.equal(directory.searchTeamMembers(examples, "", "", group.name).length, 6);
    assert.equal(directory.searchTeamMembers(examples, group.name).length, 6);
  }
  assert.equal(
    new Set(
      directory
        .publicTeamMembers(examples)
        .slice(0, 4)
        .map((member) => member.teamName)
    ).size,
    4
  );
  const changed = examples.map((member, index) => (index === 0 ? { ...member, teamName: "Tim baru" } : member));
  assert.equal(directory.groupTeamMembers(changed).find((group) => group.name === "Tim baru").members.length, 1);
});

const Card = load("components/ui/TeamDirectoryCard.tsx", {
  "react/jsx-runtime": require("react/jsx-runtime"),
  "next/image": {
    default: ({ fill: _fill, unoptimized: _unoptimized, ...props }) => React.createElement("img", props),
  },
  "lucide-react": { UserRound: () => null },
}).default;
const { TeamDirectory } = load("components/ui/TeamDirectory.tsx", {
  react: React,
  "react/jsx-runtime": require("react/jsx-runtime"),
  "lucide-react": { Search: () => null, Users: () => null },
  "@/components/ui/TeamDirectoryCard": { default: Card },
  "@/components/pages/team/TeamProfileDialog": { default: () => null },
  "@/lib/teamClient": {},
  "@/lib/teamDirectory": directory,
});
const render = (props = {}) =>
  renderToStaticMarkup(
    React.createElement(TeamDirectory, {
      members,
      loading: false,
      error: "",
      onRetry() {},
      ...props,
    })
  );

test("directory renders editable member data and role choices without exposing hidden members", () => {
  const html = render();
  assert.equal((html.match(/<article/g) || []).length, 2);
  assert.match(html, /2 anggota ditampilkan/);
  assert.match(html, /Menampilkan 2 dari 2 anggota/);
  assert.match(html, /value="Engineer"/);
  assert.doesNotMatch(html, /Private|Internal|Data contoh/);
  const updated = render({ members: [{ ...members[0], name: "Nama diperbarui", position: "Jabatan diperbarui" }] });
  assert.match(updated, /Nama diperbarui/);
  assert.match(updated, /Jabatan diperbarui/);
  assert.doesNotMatch(updated, /Rina|Engineer/);
});

test("directory distinguishes sample data, loading, errors and a real empty roster", () => {
  assert.match(render({ members: [{ ...members[0], isDemo: true }] }), /bukan profil anggota resmi/);
  const loading = render({ members: [], loading: true });
  assert.match(loading, /Memuat informasi tim/);
  assert.doesNotMatch(loading, /belum tersedia|anggota ditampilkan/);
  const failed = render({ members: [], error: "Database unavailable" });
  assert.match(failed, /role="alert"/);
  assert.match(failed, /Coba lagi/);
  assert.doesNotMatch(failed, /Database unavailable|<article/);
  const empty = render({ members: [] });
  assert.match(empty, /Profil anggota tim belum tersedia/);
  assert.doesNotMatch(empty, /role="search"|<article|Andi|Rina/);
  const stale = render({ error: "Offline" });
  assert.match(stale, /Daftar terakhir tetap ditampilkan/);
  assert.equal((stale.match(/<article/g) || []).length, 2);
});

test("directory renders four saved team groups and six editable profiles per group", () => {
  const examples = load("data/teamMembers.ts").demoTeamMembers;
  const html = render({ members: examples });
  assert.equal((html.match(/<article/g) || []).length, 24);
  assert.equal((html.match(/aria-labelledby="team-group-heading-/g) || []).length, 4);
  assert.equal((html.match(/>6 anggota</g) || []).length, 4);
  assert.match(html, />Tim</);
  assert.doesNotMatch(html, /Kelompok tim/);
  assert.match(html, /4 tim/);
  assert.match(html, /24 anggota ditampilkan/);
  assert.equal((html.match(/<h4/g) || []).length, 24);
  assert.equal((html.match(/aria-haspopup="dialog"/g) || []).length, 24);
});
