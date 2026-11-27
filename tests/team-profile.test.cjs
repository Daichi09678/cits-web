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
  "next/link": {
    default: ({ children, href, ...props }) => React.createElement("a", { href, ...props }, children),
  },
  "lucide-react": Object.fromEntries(
    ["CalendarDays", "Mail", "ShieldCheck", "UserRound", "Users", "X"].map((icon) => [icon, () => null])
  ),
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

test("profile dialogs retain empty-description fallbacks and omit the example badge", () => {
  assert.match(render(), /Deskripsi anggota ini belum tersedia/);
  assert.match(render({ description: "  " }), /Deskripsi anggota ini belum tersedia/);
  assert.match(render({ teamName: "" }), /Tim: Belum ditentukan/);
  assert.doesNotMatch(render({ isDemo: true, showDemoOnAbout: true }), /Profil ilustrasi/);
  assert.doesNotMatch(render(), /Profil ilustrasi/);
  assert.doesNotMatch(render(), /Bidang keahlian|Peran dalam proyek|Fokus layanan|Ketersediaan/);
  assert.doesNotMatch(render(), /Hubungi Tim CITS/);
});

test("all built-in examples have full details and legacy samples keep saved edits", () => {
  const { demoTeamMembers, withExampleProfileDetails } = load("data/teamMembers.ts");
  assert.equal(demoTeamMembers.length, 24);
  for (const sample of demoTeamMembers) {
    assert.ok(sample.description && sample.serviceFocus && sample.availability, sample.name);
    assert.equal(sample.expertise?.length, 4, sample.name);
    assert.equal(sample.projectRoles?.length, 3, sample.name);
    const legacy = { id: sample.id, name: sample.name, isDemo: true, description: "Deskripsi disimpan" };
    const filled = withExampleProfileDetails(legacy);
    assert.equal(filled.description, legacy.description);
    assert.equal(filled.expertise, sample.expertise);
    assert.equal(filled.projectRoles, sample.projectRoles);
    const official = { ...legacy, isDemo: false };
    assert.equal(withExampleProfileDetails(official), official);
    assert.equal(withExampleProfileDetails({ ...legacy, expertise: [] }).expertise.length, 0);
  }
});

test("optional profile fields survive validation and render as saved content", () => {
  const { parseTeamMember } = load("lib/team.ts");
  const input = {
    ...member,
    expertise: [" Arsitektur Sistem ", "Arsitektur Sistem"],
    projectRoles: ["Meninjau rancangan teknis"],
    serviceFocus: " Pengembangan Aplikasi ",
    availability: "Tersedia untuk konsultasi",
  };
  const parsed = parseTeamMember(input);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.value.expertise.length, 1);
  assert.equal(parsed.value.expertise[0], "Arsitektur Sistem");
  assert.equal(parsed.value.serviceFocus, "Pengembangan Aplikasi");
  assert.equal(parseTeamMember({ ...input, projectRoles: ["x".repeat(301)] }).ok, false);
  const html = render(parsed.value);
  const AdminDetails = load("components/admin/team/TeamMemberDetails.tsx", {
    "react/jsx-runtime": require("react/jsx-runtime"),
    "next/image": { default: () => null },
    "lucide-react": { Pencil: () => null, UserRound: () => null },
    "@/lib/team": { isPublicTeamMember: () => true },
    "./TeamDialog": { default: ({ children }) => children, teamPrimary: "", teamSecondary: "" },
  }).default;
  const adminHtml = renderToStaticMarkup(
    React.createElement(AdminDetails, { member: { ...member, ...parsed.value }, titleId: "test-detail-title" })
  );
  assert.match(adminHtml, /Tentang anggota/);
  assert.match(adminHtml, /Bidang keahlian/);
  assert.match(adminHtml, /Peran dalam proyek/);
  assert.match(adminHtml, /Arsitektur Sistem/);
  assert.match(adminHtml, /Meninjau rancangan teknis/);
  for (const text of [
    "Arsitektur Sistem",
    "Meninjau rancangan teknis",
    "Pengembangan Aplikasi",
    "Tersedia untuk konsultasi",
  ])
    assert.ok(html.includes(text));
});
