const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load } = require("./helpers/load.cjs");
const definitions = load("data/publicPageContent.ts");
const content = load("lib/publicPageContent.ts", { "@/data/publicPageContent": definitions });
const editor = load("lib/aboutEditor.ts", { "./publicPageContent": content }, { Error });
const profile = load("data/initialData.ts").initialAboutData;

test("about editor covers the seven actual website sections and uses descriptive field labels", () => {
  const sections = definitions.publicPageDefinitions.about.sections;
  assert.equal(sections.length, 7);
  for (const section of sections) {
    assert.ok(editor.aboutSectionDescriptions[section.key]);
    for (const field of section.fields) {
      assert.ok(editor.aboutFieldLabels[field.key] || field.kind === "image" || field.key.includes("_alt_"), field.key);
    }
  }
});

test("hiding an about section preserves all text, collections, and other section visibility", () => {
  const original = structuredClone(content.resolvePublicPageContent("about"));
  const next = structuredClone(original);
  next.visibility["milestones-heading"] = false;
  const prepared = editor.prepareAboutContent(next);
  assert.equal(prepared.visibility["milestones-heading"], false);
  assert.equal(JSON.stringify(prepared.texts), JSON.stringify(original.texts));
  assert.equal(JSON.stringify(prepared.collections), JSON.stringify(original.collections));
  assert.equal(prepared.visibility["about-hero-heading"], true);
  prepared.visibility["milestones-heading"] = true;
  assert.equal(
    JSON.stringify(editor.prepareAboutContent(prepared).collections.milestones),
    JSON.stringify(original.collections.milestones)
  );
});

test("visibility-only changes save only page content and never rewrite company profile or homepage data", async () => {
  const draft = structuredClone(content.resolvePublicPageContent("about"));
  draft.visibility["values-heading"] = false;
  let stored;
  const result = await editor.persistAboutChanges({
    profile: null,
    content: draft,
    saveProfile: () => assert.fail("Profile must not be rewritten"),
    saveContent: async (value) => {
      stored = value;
    },
  });
  assert.equal(result.contentSaved, true);
  assert.equal(result.profileSaved, false);
  assert.equal(stored.visibility["values-heading"], false);
  assert.deepEqual(Object.keys(stored).sort(), ["collections", "homeVisibility", "order", "texts", "visibility"]);
});

test("validation of both drafts finishes before either existing API receives a write", async () => {
  const draft = structuredClone(content.resolvePublicPageContent("about"));
  draft.texts.about_hero_href_11 = "javascript:alert(1)";
  const result = await editor.persistAboutChanges({
    profile,
    content: draft,
    saveProfile: () => assert.fail("Invalid batch cannot write profile"),
    saveContent: () => assert.fail("Invalid content cannot be written"),
  });
  assert.ok(result.error);
  assert.equal(result.profileSaved, false);
  assert.equal(result.contentSaved, false);
});

test("a failed second API reports the confirmed partial save and leaves content available for retry", async () => {
  let profileWrites = 0;
  const draft = structuredClone(content.resolvePublicPageContent("about"));
  const result = await editor.persistAboutChanges({
    profile,
    content: draft,
    saveProfile: async () => {
      profileWrites++;
    },
    saveContent: async () => {
      throw new Error("Server unavailable");
    },
  });
  assert.equal(result.profileSaved, true);
  assert.equal(result.contentSaved, false);
  assert.match(result.error, /Profil perusahaan sudah tersimpan/);
  const retry = await editor.persistAboutChanges({
    profile: null,
    content: draft,
    saveProfile: () => assert.fail("Confirmed profile must not be written twice"),
    saveContent: async () => {},
  });
  assert.equal(retry.error, "");
  assert.equal(retry.contentSaved, true);
  assert.equal(profileWrites, 1);
});

test("a failed profile request cannot claim success or send the second write", async () => {
  const result = await editor.persistAboutChanges({
    profile,
    content: content.resolvePublicPageContent("about"),
    saveProfile: async () => {
      throw new Error("Profile save failed");
    },
    saveContent: () => assert.fail("Content save must wait for the profile"),
  });
  assert.equal(result.profileSaved, false);
  assert.equal(result.contentSaved, false);
  assert.match(result.error, /Profile save failed/);
});

test("removing a logo uses a valid transparent image supported by the unchanged content API", () => {
  const draft = structuredClone(content.resolvePublicPageContent("about"));
  draft.texts.about_hero_src_5 = editor.EMPTY_ABOUT_LOGO;
  draft.texts.about_hero_alt_6 = "";
  assert.doesNotThrow(() => editor.prepareAboutContent(draft));
  const png = Buffer.from(editor.EMPTY_ABOUT_LOGO.split(",")[1], "base64");
  assert.equal(png.subarray(1, 4).toString(), "PNG");
  assert.equal(png.readUInt32BE(16), 1);
});
