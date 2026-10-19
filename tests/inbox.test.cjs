const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');

function load(relative, overrides = {}, globals = {}) {
  const filename = path.resolve(__dirname, '../src', relative);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: (id) => {
    if (id in overrides) return overrides[id];
    throw new Error(`Unexpected import: ${id}`);
  }, console, ...globals }, { filename });
  return exports;
}

test('failed inbox requests must not masquerade as a successfully empty inbox', async () => {
  const { citsApi } = load('lib/api.ts', {}, {
    fetch: async () => ({ ok: false, status: 503 }),
  });
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
    addEventListener: (name, fn) => { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
    removeEventListener: (name, fn) => listeners.get(name)?.delete(fn),
    dispatchEvent: (event) => { events.push(event); listeners.get(event.type)?.forEach(fn => fn(event)); },
  };
  const storageApi = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
  const api = new Proxy({}, { get: (_, name) => async () => {
    if (name === 'getMessages') { requests++; if (response instanceof Error) throw response; return response; }
    return null;
  }});
  const store = load('database/store.ts', {
    react: { useEffect: fn => effects.push(fn), useState: value => [typeof value === 'function' ? value() : value, () => {}], useRef: value => ({ current: value }) },
    './initialData': new Proxy({}, { get: () => [] }),
    '@/config/siteConfig': { siteConfig: { storageKeys: { messages: 'messages' } } },
    '@/lib/api': { citsApi: api },
    '@/lib/audio': { playNewMessageSound: () => events.push({ type: 'sound' }) },
  }, { window, localStorage: storageApi, sessionStorage: storageApi,
    document: { visibilityState: 'visible', addEventListener: window.addEventListener, removeEventListener: window.removeEventListener },
    Event: class { constructor(type) { this.type = type; } },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    setInterval: fn => { const id = Symbol(); intervals.set(id, fn); return id; }, clearInterval: id => intervals.delete(id),
    setTimeout, clearTimeout, process: { env: {} },
  });
  return { ...store, effects, intervals, events, get requests() { return requests; }, set response(value) { response = value; } };
}

const flush = () => new Promise(resolve => setImmediate(resolve));

test('generic store consumers do not start private inbox polling or swallow notifications', async () => {
  const h = storeHarness();
  h.useCitsStore();
  h.useCitsStore();
  const cleanups = h.effects.map(fn => fn());
  await flush();
  cleanups.forEach(fn => fn?.());
  assert.equal(h.requests, 0);
});

test('admin sync keeps messages on failure and notifies each new ID only once across remounts', async () => {
  const h = storeHarness();
  const old = { id: 'old', status: 'unread' };
  const incoming = { id: 'new', status: 'unread' };
  h.response = [old];
  let stop = h.startAdminInboxSync();
  await flush();
  assert.equal(h.events.filter(e => e.type === 'sound').length, 0);
  h.response = [incoming, old];
  await Promise.all([...h.intervals.values()].map(fn => fn()));
  assert.equal(h.events.filter(e => e.type === 'sound').length, 1);
  h.response = new Error('offline');
  await Promise.all([...h.intervals.values()].map(fn => fn()));
  assert.equal(h.CitsStore.getMessages().length, 2);
  stop();
  h.response = [incoming, old];
  stop = h.startAdminInboxSync();
  await flush();
  await Promise.all([...h.intervals.values()].map(fn => fn()));
  stop();
  assert.equal(h.events.filter(e => e.type === 'cits-realtime-message').length, 1);
  assert.equal(h.intervals.size, 0);
});

test('overlapping polls are skipped and responses after cleanup cannot overwrite inbox', async () => {
  const h = storeHarness();
  let resolve;
  h.response = new Promise(done => { resolve = done; });
  const stop = h.startAdminInboxSync();
  await Promise.all([...h.intervals.values()].map(fn => fn()));
  assert.equal(h.requests, 1);
  stop();
  resolve([{ id: 'stale', status: 'unread' }]);
  await flush();
  assert.equal(h.CitsStore.getMessages().length, 0);
  assert.equal(h.events.filter(e => e.type === 'sound').length, 0);
});

test('locally cached incoming messages still notify and batches notify once per ID', async () => {
  const h = storeHarness();
  const stop = h.startAdminInboxSync();
  await flush();
  const batch = [{ id: 'one', status: 'unread' }, { id: 'two', status: 'unread' }];
  h.CitsStore.saveMessages(batch);
  h.response = batch;
  for (let i = 0; i < 5; i++) await Promise.all([...h.intervals.values()].map(fn => fn()));
  stop();
  assert.equal(h.events.filter(e => e.type === 'cits-realtime-message').length, 2);
});

module.exports = { load };
