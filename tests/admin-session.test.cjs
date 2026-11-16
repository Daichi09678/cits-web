const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load } = require("./helpers/load.cjs");

const sessionKey = "cits_admin_session";
const tokenKey = "cits_jwt_token";
const session = { isLoggedIn: true, user: { email: "admin@example.test", name: "Admin", role: "Super Admin" } };
const settle = () => new Promise((resolve) => setImmediate(resolve));

function browser() {
  const values = new Map([
    [sessionKey, JSON.stringify(session)],
    [tokenKey, "token-a"],
  ]);
  const window = new EventTarget();
  const document = new EventTarget();
  document.visibilityState = "visible";
  const intervals = new Set();
  const intervalDelays = [];
  window.setInterval = (callback, delay) => {
    intervalDelays.push(delay);
    intervals.add(callback);
    return callback;
  };
  window.clearInterval = (callback) => intervals.delete(callback);
  return {
    window,
    document,
    Event,
    intervals,
    intervalDelays,
    localStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => values.delete(key),
    },
  };
}

function auth(globals) {
  const states = [];
  const effects = [];
  let cursor = 0;
  let mounted = false;
  const api = load(
    "lib/auth.ts",
    {
      react: {
        useState: (initial) => {
          const index = cursor++;
          if (!(index in states)) states[index] = initial;
          return [
            states[index],
            (value) => {
              states[index] = value;
            },
          ];
        },
        useEffect: (callback) => {
          if (!mounted) effects.push(callback);
        },
      },
      "@/config/siteConfig": { siteConfig: { admin: { sessionKey } } },
      "./api": { citsApi: {} },
      "./internalAccountsApi": {},
    },
    globals
  );
  const cleanups = [];
  return {
    ...api,
    render() {
      cursor = 0;
      const result = api.useAdminAuth();
      if (!mounted) {
        mounted = true;
        cleanups.push(...effects.map((effect) => effect()));
      }
      return result;
    },
    cleanup: () => cleanups.forEach((cleanup) => cleanup()),
  };
}

function sync(globals, AdminAuth, getMe) {
  const effects = [];
  const component = load(
    "components/pages/admin/AdminSessionSync.tsx",
    {
      react: { useEffect: (callback) => effects.push(callback) },
      "next/navigation": { usePathname: () => "/admin" },
      "@/lib/auth": { AdminAuth },
      "@/lib/api": { citsApi: { getMe } },
      "@/config/siteConfig": { siteConfig: { admin: { sessionKey } } },
    },
    globals
  ).default;
  component();
  return effects[0]();
}

test("missing token, logged-out flag, and malformed cached sessions are not authenticated", () => {
  const globals = browser();
  const { AdminAuth } = auth(globals);
  assert.equal(AdminAuth.isAuthenticated(), true);
  for (const value of [
    "null",
    "{}",
    "{broken",
    JSON.stringify({ ...session, isLoggedIn: false }),
    JSON.stringify({ isLoggedIn: true, user: {} }),
  ]) {
    globals.localStorage.setItem(sessionKey, value);
    assert.equal(AdminAuth.getSession(), null, value);
  }
  globals.localStorage.setItem(sessionKey, JSON.stringify(session));
  globals.localStorage.removeItem(tokenKey);
  assert.equal(AdminAuth.isAuthenticated(), false);
});

test("auth hooks notice logout on focus, visibility, history restore, and cross-tab storage events", () => {
  for (const eventName of ["focus", "visibilitychange", "pageshow", "storage"]) {
    const globals = browser();
    const hooks = auth(globals);
    hooks.render();
    assert.equal(hooks.render().isAuthenticated, true);
    globals.localStorage.removeItem(tokenKey);
    const event = new Event(eventName);
    event.key = tokenKey;
    (eventName === "visibilitychange" ? globals.document : globals.window).dispatchEvent(event);
    assert.equal(hooks.render().isAuthenticated, false, eventName);
    hooks.cleanup();
  }
});

test("returning to a superadmin tab revalidates its token and clears rejected credentials", async () => {
  for (const status of [401, 403]) {
    const globals = browser();
    const hooks = auth(globals);
    hooks.render();
    let calls = 0;
    const cleanup = sync(globals, hooks.AdminAuth, async (token) => {
      assert.equal(token, "token-a");
      calls++;
      return calls === 1 ? { success: true, user: session.user } : { success: false, status };
    });
    await settle();
    assert.equal(calls, 1);
    globals.document.visibilityState = "hidden";
    globals.document.dispatchEvent(new Event("visibilitychange"));
    assert.equal(calls, 1);
    globals.document.visibilityState = "visible";
    globals.document.dispatchEvent(new Event("visibilitychange"));
    await settle();
    assert.equal(calls, 2);
    assert.equal(hooks.render().isAuthenticated, false);
    assert.equal(globals.localStorage.getItem(sessionKey), null);
    assert.equal(globals.localStorage.getItem(tokenKey), null);
    cleanup();
    hooks.cleanup();
    assert.equal(globals.intervals.size, 0);
  }
});

test("a stale server response cannot log out a newly signed-in account", async () => {
  const globals = browser();
  const { AdminAuth } = auth(globals);
  let complete;
  const cleanup = sync(
    globals,
    AdminAuth,
    () =>
      new Promise((resolve) => {
        complete = resolve;
      })
  );
  globals.localStorage.setItem(tokenKey, "token-b");
  complete({ success: false, status: 401 });
  await settle();
  assert.equal(globals.localStorage.getItem(tokenKey), "token-b");
  assert.equal(AdminAuth.isAuthenticated(), true);
  cleanup();
});

test("temporary session endpoint failures preserve credentials for retry", async () => {
  const globals = browser();
  const { AdminAuth } = auth(globals);
  let calls = 0;
  const cleanup = sync(globals, AdminAuth, async () => {
    calls++;
    if (calls === 1) throw new Error("Offline");
    return { success: false, status: 503 };
  });
  await settle();
  globals.window.dispatchEvent(new Event("focus"));
  await settle();
  assert.equal(calls, 2);
  assert.equal(AdminAuth.isAuthenticated(), true);
  cleanup();
});

test("session polling uses 30 seconds, skips hidden tabs, and revalidates immediately on return", async () => {
  const globals = browser();
  const { AdminAuth } = auth(globals);
  let calls = 0;
  const cleanup = sync(globals, AdminAuth, async () => {
    calls++;
    return { success: true, user: session.user };
  });
  await settle();
  assert.deepEqual(globals.intervalDelays, [30_000]);
  assert.equal(calls, 1);
  const poll = [...globals.intervals][0];
  poll();
  await settle();
  assert.equal(calls, 2);
  globals.document.visibilityState = "hidden";
  poll();
  globals.window.dispatchEvent(new Event("focus"));
  globals.window.dispatchEvent(new Event("cits-permissions-changed"));
  await settle();
  assert.equal(calls, 2);
  globals.document.visibilityState = "visible";
  globals.document.dispatchEvent(new Event("visibilitychange"));
  await settle();
  assert.equal(calls, 3);
  cleanup();
  globals.window.dispatchEvent(new Event("focus"));
  globals.window.dispatchEvent(new Event("cits-permissions-changed"));
  globals.document.dispatchEvent(new Event("visibilitychange"));
  poll();
  await settle();
  assert.equal(calls, 3);
  assert.equal(globals.intervals.size, 0);
});

test("a session mounted in the background waits until the tab becomes visible", async () => {
  const globals = browser();
  globals.document.visibilityState = "hidden";
  const { AdminAuth } = auth(globals);
  let calls = 0;
  const cleanup = sync(globals, AdminAuth, async () => {
    calls++;
    return { success: true, user: session.user };
  });
  await settle();
  assert.equal(calls, 0);
  globals.document.visibilityState = "visible";
  globals.window.dispatchEvent(new Event("pageshow"));
  await settle();
  assert.equal(calls, 1);
  cleanup();
});

test("permission changes during a request queue one fresh check without overlapping calls", async () => {
  const globals = browser();
  const { AdminAuth } = auth(globals);
  let calls = 0;
  let complete;
  const cleanup = sync(globals, AdminAuth, () => {
    calls++;
    if (calls === 1)
      return new Promise((resolve) => {
        complete = resolve;
      });
    return Promise.resolve({ success: true, user: { ...session.user, permissions: {} } });
  });
  globals.window.dispatchEvent(new Event("focus"));
  [...globals.intervals][0]();
  globals.window.dispatchEvent(new Event("cits-permissions-changed"));
  globals.window.dispatchEvent(new Event("cits-permissions-changed"));
  assert.equal(calls, 1);
  complete({ success: true, user: { ...session.user, permissions: { products: ["view", "edit"] } } });
  await settle();
  assert.equal(calls, 2);
  assert.equal(JSON.stringify(AdminAuth.getSession().user.permissions), "{}");
  const unrelatedStorage = new Event("storage");
  unrelatedStorage.key = "unrelated-key";
  globals.window.dispatchEvent(unrelatedStorage);
  assert.equal(calls, 2);
  cleanup();
});

test("switching tokens queues verification of the new session and discards the old response", async () => {
  const globals = browser();
  const { AdminAuth } = auth(globals);
  const tokens = [];
  let complete;
  const cleanup = sync(globals, AdminAuth, (token) => {
    tokens.push(token);
    if (tokens.length === 1)
      return new Promise((resolve) => {
        complete = resolve;
      });
    return Promise.resolve({ success: true, user: { ...session.user, name: "New account" } });
  });
  globals.localStorage.setItem(tokenKey, "token-b");
  const changed = new Event("storage");
  changed.key = tokenKey;
  globals.window.dispatchEvent(changed);
  complete({ success: false, status: 401 });
  await settle();
  assert.deepEqual(tokens, ["token-a", "token-b"]);
  assert.equal(AdminAuth.getSession().user.name, "New account");
  assert.equal(globals.localStorage.getItem(tokenKey), "token-b");
  cleanup();
});

test("unmounting discards late responses and any queued permission refresh", async () => {
  const globals = browser();
  const { AdminAuth } = auth(globals);
  let complete;
  let calls = 0;
  const cleanup = sync(globals, AdminAuth, () => {
    calls++;
    return new Promise((resolve) => {
      complete = resolve;
    });
  });
  globals.window.dispatchEvent(new Event("cits-permissions-changed"));
  cleanup();
  complete({ success: false, status: 401 });
  await settle();
  assert.equal(calls, 1);
  assert.equal(AdminAuth.isAuthenticated(), true);
  assert.equal(globals.intervals.size, 0);
});

test("admin layout redirects unauthenticated visitors and leaves login available", () => {
  for (const pathname of ["/admin", "/admin/products", "/admin/login"]) {
    const redirects = [];
    const component = load("app/(admin)/admin/layout.tsx", {
      react: { useEffect: (callback) => callback() },
      "react/jsx-runtime": require("react/jsx-runtime"),
      "next/navigation": { usePathname: () => pathname, useRouter: () => ({ replace: (url) => redirects.push(url) }) },
      "@/lib/auth": { useAdminAuth: () => ({ isAuthenticated: false, loading: false }) },
      "@/components/pages/admin/AdminShell": {},
      "@/components/pages/admin/RealtimeNotificationToast": {},
      "@/components/pages/admin/AdminPageTransitionLoader": {},
    }).default;
    const output = component({ children: "content" });
    if (pathname === "/admin/login") {
      assert.deepEqual(redirects, []);
      assert.ok(output);
    } else {
      assert.deepEqual(redirects, ["/admin/login"]);
      assert.equal(output, null);
    }
  }
});
