const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load } = require("./helpers/load.cjs");

function app() {
  const storage = new Map(),
    calls = {},
    events = [];
  const timers = new Map();
  const listeners = new Map();
  const snapshots = {};
  const document = {
    hidden: false,
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: (name) => listeners.delete(name),
  };
  const keys = {
    products: "products",
    contactInfo: "contact",
    about: "about",
    clients: "clients",
    landing: "landing",
    services: "services",
    portfolio: "portfolio",
  };
  let finish;
  const wait = new Promise((resolve) => {
    finish = resolve;
  });
  const api = Object.fromEntries(
    [
      "getAllProducts",
      "getContactInfo",
      "getAboutData",
      "getClients",
      "getLandingData",
      "getServices",
      "getPortfolio",
    ].map((method) => [
      method,
      async () => {
        calls[method] = (calls[method] || 0) + 1;
        await wait;
        if (method in snapshots) return snapshots[method];
        return ["getContactInfo", "getAboutData", "getLandingData"].includes(method)
          ? { title: method }
          : [{ id: method }];
      },
    ])
  );
  const store = load(
    "stores/citsStore.ts",
    {
      react: {},
      "@/data/initialData": new Proxy({}, { get: () => [] }),
      "@/config/siteConfig": { siteConfig: { storageKeys: keys } },
      "@/lib/api": { citsApi: api },
      "@/lib/actionAccessClient": { assertPageAction() {} },
      "@/lib/internalAccess": {},
      "@/lib/audio": {},
    },
    {
      window: {
        dispatchEvent: (event) => events.push(event.type),
        addEventListener: document.addEventListener,
        removeEventListener: document.removeEventListener,
      },
      document,
      setInterval: (fn) => {
        const id = Symbol();
        timers.set(id, fn);
        return id;
      },
      clearInterval: (id) => timers.delete(id),
      localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
      Event: class {
        constructor(type) {
          this.type = type;
        }
      },
    }
  );
  return { ...store, storage, calls, events, finish, timers, listeners, document, snapshots };
}

test("header, sidebar and page share seven requests and one content notification during navigation", async () => {
  const state = app();
  const pending = [state.syncContentFromBackend(), state.syncContentFromBackend(), state.syncContentFromBackend()];
  assert.equal(pending[0], pending[1]);
  state.finish();
  await Promise.all(pending);
  assert.equal(Object.keys(state.calls).length, 7);
  assert.ok(Object.values(state.calls).every((count) => count === 1));
  assert.deepEqual(state.events, ["cits-data-updated"]);
  await state.syncContentFromBackend();
  assert.ok(Object.values(state.calls).every((count) => count === 1));
  await state.syncContentFromBackend(true);
  assert.ok(Object.values(state.calls).every((count) => count === 2));
  assert.equal(state.events.length, 1, "unchanged snapshots must not rerender every store consumer");
});

test("a delayed background read cannot overwrite a completed admin save", async () => {
  const state = app();
  const pending = state.syncContentFromBackend();
  state.storage.set("products", JSON.stringify([{ id: "saved-later" }]));
  state.finish();
  await pending;
  assert.equal(JSON.parse(state.storage.get("products"))[0].id, "saved-later");
  assert.equal(state.storage.has("services"), true);
});

test("cached content is invalidated when the signed-in session changes", async () => {
  const state = app();
  state.finish();
  await state.syncContentFromBackend();
  state.storage.set("cits_jwt_token", "another-session");
  await state.syncContentFromBackend();
  assert.ok(Object.values(state.calls).every((count) => count === 2));
});

test("repeated local reads reuse parsed content until the stored JSON changes", () => {
  const state = app();
  state.storage.set("products", JSON.stringify([{ id: "a" }]));
  const first = state.CitsStore.getProducts();
  assert.equal(first, state.CitsStore.getProducts());
  state.storage.set("products", JSON.stringify([{ id: "b" }]));
  assert.equal(state.CitsStore.getProducts()[0].id, "b");
  assert.notEqual(first, state.CitsStore.getProducts());
});

test("open public pages share one refresh and receive external client edits and deletions", async () => {
  const state = app();
  state.finish();
  await state.syncContentFromBackend();
  const stopHeader = state.startContentRefresh();
  const stopPage = state.startContentRefresh();
  assert.equal(state.timers.size, 1);
  state.snapshots.getClients = [{ id: "client", name: "Renamed partner", logo: "/new-logo.webp" }];
  state.listeners.get("focus")();
  await state.syncContentFromBackend();
  assert.equal(state.CitsStore.getClients()[0].logo, "/new-logo.webp");
  state.snapshots.getClients = [];
  [...state.timers.values()][0]();
  await state.syncContentFromBackend();
  assert.equal(state.CitsStore.getClients().length, 0);
  const requests = state.calls.getClients;
  state.document.hidden = true;
  [...state.timers.values()][0]();
  assert.equal(state.calls.getClients, requests);
  stopHeader();
  assert.equal(state.timers.size, 1);
  stopPage();
  assert.equal(state.timers.size, 0);
  assert.equal(state.listeners.size, 0);
});

test("navigation feedback follows the real Link pending state without a fullscreen overlay or timers", () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  let pending = false;
  const Indicator = load("components/admin/AdminPageTransitionLoader.tsx", {
    "react/jsx-runtime": require("react/jsx-runtime"),
    "next/link": { useLinkStatus: () => ({ pending }) },
  }).default;
  assert.doesNotMatch(renderToStaticMarkup(React.createElement(Indicator)), /Memuat|role="status"/);
  pending = true;
  const html = renderToStaticMarkup(React.createElement(Indicator));
  assert.match(html, /role="status"/);
  assert.match(html, /Memuat halaman/);
  assert.doesNotMatch(html, /fixed|backdrop|%|Mbps/);
});
