const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load } = require("./helpers/load.cjs");
const initial = load("data/initialData.ts");
const globals = { Error, setTimeout() {} };
const event = () => ({ preventDefault() {} });

test("landing feedback waits for persistence, prevents duplicate saves and keeps failed drafts", async () => {
  let finish;
  let calls = 0;
  const statuses = [];
  const errors = [];
  const saved = [];
  const state = {
    formData: structuredClone(initial.initialLandingPageData),
    contentBusy: { current: false },
    setIsSaving: (value) => statuses.push(value),
    setSaveError: (value) => errors.push(value),
    setSavedSuccess: (value) => saved.push(value),
    setFormData: () => assert.fail("Failed save must retain the form"),
    actions: {
      saveLandingData: () => {
        calls++;
        return new Promise((resolve, reject) => {
          finish = { resolve, reject };
        });
      },
    },
    dialog: { alert() {}, confirm: async () => true },
  };
  const create = load(
    "components/pages/admin-landing/createLandingContentActions.ts",
    { "@/data/initialData": initial, "@/lib/focusContent": load("lib/focusContent.ts") },
    globals
  ).default;
  const actions = create(state);
  const pending = actions.handleSave(event());
  await actions.handleSave(event());
  assert.equal(calls, 1);
  assert.equal(statuses.at(-1), true);
  assert.equal(saved.includes(true), false);
  finish.reject(new Error("Database unavailable"));
  await pending;
  assert.equal(errors.at(-1), "Database unavailable");
  assert.equal(statuses.at(-1), false);
  const retry = actions.handleSave(event());
  finish.resolve();
  await retry;
  assert.equal(saved.at(-1), true);
});

test("landing reset preserves unsaved fields until the reset has succeeded", async () => {
  let resets = 0;
  let finish;
  const draft = structuredClone(initial.initialLandingPageData);
  draft.hero.headlinePrefix = "Draf belum disimpan";
  const create = load(
    "components/pages/admin-landing/createLandingContentActions.ts",
    { "@/data/initialData": initial, "@/lib/focusContent": load("lib/focusContent.ts") },
    globals
  ).default;
  const state = {
    formData: draft,
    contentBusy: { current: false },
    setIsSaving() {},
    setSaveError() {},
    setSavedSuccess() {},
    setFormData: () => resets++,
    dialog: { confirm: async () => true, alert() {} },
    actions: {
      saveLandingData: () =>
        new Promise((resolve, reject) => {
          finish = { resolve, reject };
        }),
    },
  };
  const actions = create(state);
  const pending = actions.handleReset();
  await new Promise(setImmediate);
  assert.equal(resets, 0);
  finish.reject(new Error("Offline"));
  await pending;
  assert.equal(resets, 0);
  const retry = actions.handleReset();
  await new Promise(setImmediate);
  finish.resolve();
  await retry;
  assert.equal(resets, 1);
});

test("contact and FAQ settings share a save lock and report success only after server confirmation", async () => {
  const updates = { saving: false, error: "", saved: false, faq: "" };
  let finish;
  let calls = 0;
  const create = load("components/pages/admin-contact/createContactSettingsActions.ts", {}, globals).default;
  const state = {
    canEdit: true,
    contactInfo: initial.initialContactInfo,
    clearInfoDraft() {},
    clearFaqDraft() {},
    settingsPending: { current: false },
    setSettingsSaving: (value) => (updates.saving = value),
    setSettingsError: (value) => (updates.error = value),
    setSavedSuccess: (value) => (updates.saved = value),
    setFaqSuccessMsg: (value) => (updates.faq = value),
    actions: {
      saveContactInfo: () => {
        calls++;
        return new Promise((resolve, reject) => {
          finish = { resolve, reject };
        });
      },
    },
  };
  const actions = create(state);
  const pending = actions.handleSaveInfo(event());
  await actions.handleSaveFaqSettings();
  assert.equal(calls, 1);
  assert.equal(updates.saving, true);
  assert.equal(updates.saved, false);
  finish.reject(new Error("Kontak gagal disimpan"));
  await pending;
  assert.equal(updates.error, "Kontak gagal disimpan");
  assert.equal(updates.saved, false);
  const retry = actions.handleSaveFaqSettings();
  finish.resolve();
  await retry;
  assert.match(updates.faq, /berhasil disimpan/);
  assert.equal(updates.saving, false);
  state.canEdit = false;
  await create(state).handleSaveInfo(event());
  assert.equal(calls, 2);
  assert.match(updates.error, /izin/);
});
