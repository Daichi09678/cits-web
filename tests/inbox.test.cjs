const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load } = require("./helpers/load.cjs");

test("failed inbox requests must not masquerade as a successfully empty inbox", async () => {
  const { citsApi } = load(
    "lib/api.ts",
    { "./actionAccessClient": { assertPageAction: () => {} } },
    {
      fetch: async () => ({ ok: false, status: 503 }),
    }
  );
  await assert.rejects(citsApi.getMessages());
});

function storeHarness() {
  const effects = [];
  const intervals = new Map();
  const storage = new Map();
  const events = [];
  let requests = 0;
  let response = [];
  const listeners = new Map();
  const window = {
    addEventListener: (name, fn) => {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(fn);
    },
    removeEventListener: (name, fn) => listeners.get(name)?.delete(fn),
    dispatchEvent: (event) => {
      events.push(event);
      listeners.get(event.type)?.forEach((fn) => fn(event));
    },
  };
  const storageApi = { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  const api = new Proxy(
    {},
    {
      get: (_, name) => async () => {
        if (name === "getMessages" || name === "sendMessage") {
          requests++;
          if (response instanceof Error) throw response;
          return response;
        }
        return null;
      },
    }
  );
  const store = load(
    "stores/citsStore.ts",
    {
      react: {
        useEffect: (fn) => effects.push(fn),
        useState: (value) => [typeof value === "function" ? value() : value, () => {}],
        useRef: (value) => ({ current: value }),
      },
      "@/data/initialData": new Proxy({}, { get: () => [] }),
      "@/config/siteConfig": { siteConfig: { storageKeys: { messages: "messages" } } },
      "@/lib/api": { citsApi: api },
      "@/lib/actionAccessClient": { assertPageAction: () => {} },
      "@/lib/audio": { playNewMessageSound: () => events.push({ type: "sound" }) },
    },
    {
      window,
      localStorage: storageApi,
      sessionStorage: storageApi,
      document: {
        visibilityState: "visible",
        addEventListener: window.addEventListener,
        removeEventListener: window.removeEventListener,
      },
      Event: class {
        constructor(type) {
          this.type = type;
        }
      },
      CustomEvent: class {
        constructor(type, options) {
          this.type = type;
          this.detail = options.detail;
        }
      },
      setInterval: (fn) => {
        const id = Symbol();
        intervals.set(id, fn);
        return id;
      },
      clearInterval: (id) => intervals.delete(id),
      setTimeout,
      clearTimeout,
      process: { env: {} },
    }
  );
  return {
    ...store,
    effects,
    intervals,
    events,
    get requests() {
      return requests;
    },
    set response(value) {
      response = value;
    },
  };
}

const flush = () => new Promise((resolve) => setImmediate(resolve));

test("generic store consumers do not start private inbox polling or swallow notifications", async () => {
  const h = storeHarness();
  h.useCitsStore();
  h.useCitsStore();
  const cleanups = h.effects.map((fn) => fn());
  await flush();
  cleanups.forEach((fn) => fn?.());
  assert.equal(h.requests, 0);
});

test("admin sync keeps messages on failure and notifies each new ID only once across remounts", async () => {
  const h = storeHarness();
  const old = { id: "old", status: "read" };
  const incoming = { id: "new", status: "unread" };
  h.response = [old];
  let stop = h.startAdminInboxSync();
  await flush();
  assert.equal(h.events.filter((e) => e.type === "sound").length, 0);
  h.response = [incoming, old];
  await Promise.all([...h.intervals.values()].map((fn) => fn()));
  assert.equal(h.events.filter((e) => e.type === "sound").length, 1);
  h.response = new Error("offline");
  await Promise.all([...h.intervals.values()].map((fn) => fn()));
  assert.equal(h.CitsStore.getMessages().length, 2);
  stop();
  h.response = [incoming, old];
  stop = h.startAdminInboxSync();
  await flush();
  await Promise.all([...h.intervals.values()].map((fn) => fn()));
  stop();
  assert.equal(h.events.filter((e) => e.type === "cits-realtime-message").length, 1);
  assert.equal(h.intervals.size, 0);
});

test("overlapping polls are skipped and responses after cleanup cannot overwrite inbox", async () => {
  const h = storeHarness();
  let resolve;
  h.response = new Promise((done) => {
    resolve = done;
  });
  const stop = h.startAdminInboxSync();
  await Promise.all([...h.intervals.values()].map((fn) => fn()));
  assert.equal(h.requests, 1);
  stop();
  resolve([{ id: "stale", status: "unread" }]);
  await flush();
  assert.equal(h.CitsStore.getMessages().length, 0);
  assert.equal(h.events.filter((e) => e.type === "sound").length, 0);
});

test("locally cached incoming messages still notify and batches notify once per ID", async () => {
  const h = storeHarness();
  const stop = h.startAdminInboxSync();
  await flush();
  const batch = [
    { id: "one", status: "unread" },
    { id: "two", status: "unread" },
  ];
  h.CitsStore.saveMessages(batch);
  h.response = batch;
  for (let i = 0; i < 5; i++) await Promise.all([...h.intervals.values()].map((fn) => fn()));
  stop();
  assert.equal(h.events.filter((e) => e.type === "cits-realtime-message").length, 2);
});

test("database failures must reject writes and reads instead of using per-instance memory", async () => {
  const { DbRepo } = load(
    "lib/db.ts",
    {
      postgres: {
        default: () =>
          Object.assign(
            async () => {
              throw new Error("database offline");
            },
            { json: (value) => value }
          ),
      },
      "@/data/initialData": new Proxy({}, { get: () => [] }),
      "@/config/inbox": { getMessageRetentionDays: () => 30, DEFAULT_MESSAGE_RETENTION_DAYS: 30 },
    },
    { process: { env: { DATABASE_URL: "postgres://localhost/test" } }, console: { error() {} } }
  );
  await assert.rejects(
    DbRepo.addMessage({
      id: "test",
      name: "Test",
      email: "test@example.invalid",
      company: "Test",
      phone: "0",
      message: "Test",
    }),
    /database offline/
  );
  await assert.rejects(DbRepo.getMessages(), /database offline/);
});

test("missing database configuration cannot report durable message success", async () => {
  const { DbRepo } = load(
    "lib/db.ts",
    {
      postgres: {},
      "@/data/initialData": new Proxy({}, { get: () => [] }),
      "@/config/inbox": { getMessageRetentionDays: () => 30, DEFAULT_MESSAGE_RETENTION_DAYS: 30 },
    },
    { process: { env: {} } }
  );
  await assert.rejects(DbRepo.getMessages(), /DATABASE_URL/);
});

test("submission waits for server confirmation and does not cache a failed send", async () => {
  const h = storeHarness();
  h.response = { success: false, message: "Cannot save" };
  await assert.rejects(async () => h.CitsStore.addMessage({ name: "Test" }), /Cannot save/);
  assert.equal(h.CitsStore.getMessages().length, 0);
});

test("unread messages received while logged out notify on fresh login only once", async () => {
  const h = storeHarness();
  h.response = [{ id: "offline-arrival", status: "unread" }];
  let stop = h.startAdminInboxSync();
  await flush();
  stop();
  stop = h.startAdminInboxSync();
  await flush();
  stop();
  assert.equal(h.events.filter((e) => e.type === "cits-realtime-message").length, 1);
});

test("bulk deletion removes multiple selected messages from store and syncs", async () => {
  const h = storeHarness();
  const initial = [
    { id: "msg-1", name: "User 1", status: "read", dealStage: "baru" },
    { id: "msg-2", name: "User 2", status: "unread", dealStage: "diskusi" },
    { id: "msg-3", name: "User 3", status: "replied", dealStage: "kesepakatan" },
  ];
  h.CitsStore.saveMessages(initial);
  assert.equal(h.CitsStore.getMessages().length, 3);

  // Bulk delete msg-1 and msg-3
  h.CitsStore.deleteMessages(["msg-1", "msg-3"]);
  const remaining = h.CitsStore.getMessages();
  assert.equal(remaining.length, 1);
  assert.equal(remaining[0].id, "msg-2");
});

test("updating message deal stage updates store with stage and notes", async () => {
  const h = storeHarness();
  const initial = [{ id: "msg-deal", name: "Deal Lead", status: "read", dealStage: "baru", dealNotes: "" }];
  h.CitsStore.saveMessages(initial);

  h.CitsStore.updateMessageStage("msg-deal", "kesepakatan", "Sepakat kontrak pengadaan server");
  const updated = h.CitsStore.getMessages().find((m) => m.id === "msg-deal");
  assert.equal(updated.dealStage, "kesepakatan");
  assert.equal(updated.dealNotes, "Sepakat kontrak pengadaan server");
});
