const { test } = require("node:test");
const assert = require("node:assert/strict");
const { NextResponse } = require("next/server");
const { load } = require("./helpers/load.cjs");
const { createTestAuth } = require("./helpers/auth.cjs");
const team = load("lib/team.ts");
const http = load("lib/http.ts", { "next/server": { NextResponse } });
const input = {
  name: " Anggota Uji ",
  position: " Teknisi ",
  photoUrl: null,
  displayOrder: 2,
  isActive: true,
  showOnHomepage: true,
};
const request = (method, token, body, path = "/api/team") =>
  new Request("http://localhost" + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) },
    ...(body !== undefined ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}),
  });
const context = { params: Promise.resolve({ id: "member-1" }) };

test("team validation rejects invalid names, orders, flags, and executable photo URLs", () => {
  const valid = team.parseTeamMember(input);
  assert.equal(valid.ok, true);
  assert.equal(valid.value.name, "Anggota Uji");
  assert.equal(valid.value.position, "Teknisi");
  for (const patch of [
    { name: " " },
    { name: "x".repeat(121) },
    { position: null },
    { displayOrder: -1 },
    { displayOrder: 1.2 },
    { isActive: "false" },
    { photoUrl: "javascript:alert(1)" },
    { photoUrl: "//outside.test/photo.jpg" },
    { photoUrl: "/\\outside.test/photo.jpg" },
    { photoUrl: "data:image/svg+xml;base64,AAAA" },
    { photoUrl: "https://user:pass@example.test/photo.jpg" },
  ])
    assert.equal(team.parseTeamMember({ ...input, ...patch }).ok, false, JSON.stringify(patch));
  for (const photoUrl of [
    null,
    "",
    "/team/photo.webp",
    "https://example.test/photo.jpg",
    "data:image/png;base64,aGVsbG8=",
  ])
    assert.equal(team.parseTeamMember({ ...input, photoUrl }).ok, true);
});

test("team grouping accepts an optional trimmed name and rejects malformed names", () => {
  assert.equal(
    team.parseTeamMember({ ...input, teamName: "  Pengembangan Aplikasi  " }).value.teamName,
    "Pengembangan Aplikasi"
  );
  assert.equal(team.parseTeamMember({ ...input, teamName: "" }).value.teamName, "");
  assert.equal(team.parseTeamMember(input).value.teamName, undefined);
  for (const teamName of [null, [], 7, "x".repeat(101)])
    assert.equal(team.parseTeamMember({ ...input, teamName }).ok, false);
});

test("team descriptions support paragraphs, explicit clearing, and legacy members while rejecting malformed content", () => {
  const description = "  Memimpin pengembangan aplikasi.\n\nBerfokus pada integrasi layanan.  ";
  assert.equal(team.parseTeamMember({ ...input, description }).value.description, description.trim());
  assert.equal(team.parseTeamMember({ ...input, description: "  " }).value.description, "");
  assert.equal(team.parseTeamMember(input).value.description, undefined);
  assert.equal(team.parseTeamMember({ ...input, description: "a".repeat(3000) }).ok, true);
  for (const description of [null, [], {}, 12, "a".repeat(3001)]) {
    assert.equal(team.parseTeamMember({ ...input, description }).ok, false);
  }
});

function routes(repo, auth) {
  const overrides = {
    "next/server": { NextResponse },
    "@/lib/apiAuth": auth,
    "@/lib/http": http,
    "@/lib/team": team,
    "@/lib/teamServer": { TeamRepo: repo },
  };
  return { list: load("app/api/team/route.ts", overrides), item: load("app/api/team/[id]/route.ts", overrides) };
}

test("team API preserves team, new positions and descriptions on create, edit and explicit clearing", async () => {
  const auth = createTestAuth();
  const token = auth.issueAdminToken({ sub: "admin", email: "admin@example.test", name: "Admin", role: "superadmin" });
  let stored;
  const handler = routes(
    {
      create: async (value) => {
        stored = value;
        return { ...value, id: "member-1" };
      },
      update: async (id, value) => {
        stored = value;
        return { ...value, id };
      },
    },
    auth
  );
  const created = await handler.list.POST(
    request("POST", token, {
      ...input,
      teamName: " Konsultasi TI ",
      position: " Jabatan Baru ",
      description: " Deskripsi awal. ",
    })
  );
  assert.equal(created.status, 201);
  assert.equal(stored.teamName, "Konsultasi TI");
  assert.equal(stored.position, "Jabatan Baru");
  const createdMember = (await created.json()).data;
  assert.equal(createdMember.teamName, "Konsultasi TI");
  assert.equal(createdMember.description, "Deskripsi awal.");
  const updated = await handler.item.PUT(
    request("PUT", token, {
      ...input,
      teamName: "Manajemen Proyek",
      description: "Deskripsi diperbarui.\nParagraf kedua.",
    }),
    context
  );
  assert.equal(updated.status, 200);
  assert.equal(stored.teamName, "Manajemen Proyek");
  assert.equal((await updated.json()).data.description, "Deskripsi diperbarui.\nParagraf kedua.");
  const cleared = await handler.item.PUT(
    request("PUT", token, { ...input, teamName: "Manajemen Proyek", description: "" }),
    context
  );
  assert.equal((await cleared.json()).data.description, "");
  const invalidDescription = await handler.item.PUT(request("PUT", token, { ...input, description: 12 }), context);
  assert.equal(invalidDescription.status, 400);
  assert.equal(stored.description, "");
  const invalid = await handler.list.POST(request("POST", token, { ...input, teamName: 10 }));
  assert.equal(invalid.status, 400);
  assert.equal(stored.teamName, "Manajemen Proyek");
});

test("public team responses hide inactive and unpublished members; admin listing requires team view permission", async () => {
  const auth = createTestAuth();
  const handler = routes(
    {
      list: async () => [
        { ...input, id: "public" },
        { ...input, id: "inactive", isActive: false },
        { ...input, id: "hidden", showOnHomepage: false },
      ],
    },
    auth
  );
  const response = await handler.list.GET(request("GET"));
  assert.deepEqual(
    (await response.json()).data.map((member) => member.id),
    ["public"]
  );
  assert.equal((await handler.list.GET(request("GET", null, undefined, "/api/team?admin=1"))).status, 401);
  const denied = auth.issueAdminToken({
    sub: "denied",
    email: "denied@example.test",
    role: "internal",
    name: "Viewer",
    permissions: { about: ["view"] },
  });
  assert.equal((await handler.list.GET(request("GET", denied, undefined, "/api/team?admin=1"))).status, 403);
  const viewer = auth.issueAdminToken({
    sub: "viewer",
    email: "viewer@example.test",
    role: "internal",
    name: "Viewer",
    permissions: { team: ["view"] },
  });
  const all = await handler.list.GET(request("GET", viewer, undefined, "/api/team?admin=1"));
  assert.equal((await all.json()).data.length, 3);
});

test("team create, edit, and delete each enforce permissions before reaching persistence", async () => {
  const auth = createTestAuth();
  const calls = [];
  const handler = routes(
    {
      create: async (data) => {
        calls.push("create");
        return { ...data, id: "member-1" };
      },
      update: async (id, data) => {
        assert.equal(id, "member-1");
        calls.push("edit");
        return { ...data, id };
      },
      remove: async () => {
        calls.push("delete");
        return true;
      },
    },
    auth
  );
  const viewer = auth.issueAdminToken({
    sub: "viewer",
    email: "viewer@example.test",
    role: "internal",
    name: "Viewer",
    permissions: { team: ["view"] },
  });
  for (const [action, method, invoke, expected] of [
    ["create", "POST", (req) => handler.list.POST(req), 201],
    ["edit", "PUT", (req) => handler.item.PUT(req, context), 200],
    ["delete", "DELETE", (req) => handler.item.DELETE(req, context), 200],
  ]) {
    const before = calls.length;
    assert.equal((await invoke(request(method, viewer, method === "DELETE" ? undefined : input))).status, 403);
    assert.equal(calls.length, before);
    const allowed = auth.issueAdminToken({
      sub: action,
      email: action + "@example.test",
      role: "internal",
      name: "Staff",
      permissions: { team: ["view", action] },
    });
    assert.equal((await invoke(request(method, allowed, method === "DELETE" ? undefined : input))).status, expected);
    assert.equal(calls.at(-1), action);
  }
  const creator = auth.issueAdminToken({
    sub: "creator",
    email: "creator@example.test",
    role: "superadmin",
    name: "Admin",
  });
  const before = calls.length;
  assert.equal((await handler.list.POST(request("POST", creator, { ...input, name: "" }))).status, 400);
  assert.equal((await handler.list.POST(request("POST", creator, "{broken"))).status, 400);
  assert.equal(calls.length, before);
});

test("team API returns not-found and database errors without claiming a successful write", async () => {
  const auth = createTestAuth();
  const token = auth.issueAdminToken({ sub: "admin", email: "admin@example.test", role: "superadmin", name: "Admin" });
  const missing = routes({ update: async () => null, remove: async () => false }, auth);
  assert.equal((await missing.item.PUT(request("PUT", token, input), context)).status, 404);
  assert.equal((await missing.item.DELETE(request("DELETE", token), context)).status, 404);
  const fail = async () => {
    throw Error("offline");
  };
  const broken = routes({ list: fail, create: fail, update: fail, remove: fail }, auth);
  assert.equal((await broken.list.GET(request("GET"))).status, 503);
  assert.equal((await broken.list.POST(request("POST", token, input))).status, 503);
  assert.equal((await broken.item.PUT(request("PUT", token, input), context)).status, 503);
  assert.equal((await broken.item.DELETE(request("DELETE", token), context)).status, 503);
});

test("team repository requires durable persistence and supports an empty team", async () => {
  const unavailable = load("lib/teamServer.ts", {
    "@/lib/db": { getSql: () => null },
    "@/lib/team": team,
    "@/data/teamMembers": load("data/teamMembers.ts"),
  });
  await assert.rejects(unavailable.TeamRepo.create(input), /Database/);
  await assert.rejects(unavailable.TeamRepo.list(), /Database/);
  const rows = new Map();
  const sql = Object.assign(
    async (strings, ...values) => {
      const query = strings.join("?");
      if (query.includes("INSERT")) {
        rows.set(values[0], values[1]);
        return [{ id: values[0], data: values[1] }];
      }
      if (query.includes("UPDATE")) {
        if (!rows.has(values[1])) return [];
        rows.set(values[1], values[0]);
        return [{ id: values[1], data: values[0] }];
      }
      if (query.includes("DELETE")) return rows.delete(values[0]) ? [{ id: values[0] }] : [];
      return [...rows].map(([id, data]) => ({ id, data }));
    },
    { json: (value) => value }
  );
  const repo = load("lib/teamServer.ts", {
    "@/lib/db": { getSql: () => sql, ensureDbReady: async () => {} },
    "@/lib/team": team,
    "@/data/teamMembers": load("data/teamMembers.ts"),
  }).TeamRepo;
  assert.equal((await repo.list()).length, 0);
  const member = await repo.create({ ...input, description: "Keahlian integrasi sistem." });
  assert.ok(member.id.startsWith("team-"));
  assert.equal((await repo.list())[0].description, "Keahlian integrasi sistem.");
  const changed = await repo.update(member.id, { ...input, name: "Updated", description: "Pengalaman terbaru." });
  assert.equal(changed.name, "Updated");
  assert.equal((await repo.list())[0].description, "Pengalaman terbaru.");
  await repo.update(member.id, { ...input, description: "" });
  assert.equal((await repo.list())[0].description, "");
  assert.equal(await repo.remove(member.id), true);
  assert.equal((await repo.list()).length, 0);
});

test("example endpoint requires create permission, labels dummy members and preserves an existing team", async () => {
  const auth = createTestAuth();
  let writes = 0;
  const examples = load("data/teamMembers.ts").demoTeamMembers;
  const endpoint = load("app/api/team/examples/route.ts", {
    "next/server": { NextResponse },
    "@/lib/apiAuth": auth,
    "@/lib/teamServer": {
      TeamRepo: {
        seedExamples: async () => {
          if (writes) return null;
          writes++;
          return examples;
        },
      },
    },
  });
  assert.equal((await endpoint.POST(request("POST"))).status, 401);
  const viewer = auth.issueAdminToken({
    sub: "viewer",
    name: "Viewer",
    email: "viewer@example.test",
    role: "internal",
    permissions: { team: ["view"] },
  });
  assert.equal((await endpoint.POST(request("POST", viewer))).status, 403);
  assert.equal(writes, 0);
  const admin = auth.issueAdminToken({ sub: "admin", name: "Admin", email: "admin@example.test", role: "superadmin" });
  const created = await endpoint.POST(request("POST", admin));
  assert.equal(created.status, 201);
  assert.equal(
    (await created.json()).data.every((member) => member.isDemo === true),
    true
  );
  assert.equal((await endpoint.POST(request("POST", admin))).status, 409);
  assert.equal(writes, 1);
  for (const member of examples) assert.equal(team.parseTeamMember(member).value.isDemo, true);
  assert.equal(team.parseTeamMember({ ...examples[0], isDemo: false }).value.isDemo, false);
});
