const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { load } = require("./helpers/load.cjs");
const access = load("lib/internalAccess.ts");
const plain = (value) => JSON.parse(JSON.stringify(value));
const flush = () => new Promise((resolve) => setImmediate(resolve));
function hooks() {
  const values = [];
  let cursor = 0;
  return {
    reset: () => {
      cursor = 0;
    },
    react: {
      ...React,
      useState(initial) {
        const i = cursor++;
        if (!(i in values)) values[i] = typeof initial === "function" ? initial() : initial;
        return [
          values[i],
          (next) => {
            values[i] = typeof next === "function" ? next(values[i]) : next;
          },
        ];
      },
      useRef(initial) {
        const i = cursor++;
        return values[i] ?? (values[i] = { current: initial });
      },
    },
  };
}
function find(node, predicate) {
  if (!node || typeof node !== "object") return;
  if (predicate(node)) return node;
  for (const child of React.Children.toArray(node.props?.children)) {
    const result = find(child, predicate);
    if (result) return result;
  }
}
const shared = {
  "react/jsx-runtime": require("react/jsx-runtime"),
  "lucide-react": require("lucide-react"),
  "@/lib/internalAccess": access,
};
test("permission buttons can enable Edit directly, retain view-only access, and revoke all actions with Lihat", () => {
  const state = hooks();
  let value = {};
  const Matrix = load("components/admin/settings/PermissionMatrix.tsx", {
    ...shared,
    react: state.react,
    "./styles": { fieldClass: "" },
  }).default;
  const render = () => {
    state.reset();
    return Matrix({
      value,
      onChange: (next) => {
        value = next;
      },
    });
  };
  const button = (label) => find(render(), (node) => node.props?.["aria-label"] === label);
  assert.equal(button("Edit Produk").props.disabled, false);
  button("Edit Produk").props.onClick();
  assert.deepEqual(plain(value), { products: ["view", "edit"] });
  assert.equal(button("Edit Produk").props["aria-checked"], true);
  button("Edit Produk").props.onClick();
  assert.deepEqual(plain(value), { products: ["view"] });
  button("Tambah Produk").props.onClick();
  button("Lihat Produk").props.onClick();
  assert.deepEqual(plain(value), {});
});
test("access levels apply only to assigned modules and never grant create/delete", () => {
  const preset = access.applyAccessPreset({ products: ["view", "create", "edit", "delete"] }, "edit");
  assert.deepEqual(plain(preset), { products: ["view", "edit"] });
  assert.equal(access.canPerformAction({ role: "Admin Internal", permissions: preset }, "products", "delete"), false);
  assert.deepEqual(plain(access.applyAccessPreset(preset, "view")), { products: ["view"] });
});
function editor(update, accountOverride) {
  const state = hooks();
  const calls = [];
  const saved = [];
  let account =
    accountOverride === undefined
      ? {
          id: "staff",
          name: "Staff",
          email: "staff@example.test",
          isActive: true,
          permissions: { products: ["view"] },
          pageAccess: ["products"],
        }
      : accountOverride;
  const Matrix = () => null;
  const Component = load(
    "components/admin/settings/AdminAccountEditor.tsx",
    {
      ...shared,
      react: state.react,
      "@/lib/internalAccountsApi": {
        updateInternalAccount: async (id, input) => {
          calls.push({ id, input });
          return update(id, input);
        },
        createInternalAccount: () => assert.fail("Unexpected creation"),
      },
      "@/lib/password": load("lib/password.ts"),
      "@/lib/passwordApi": { sendAdminResetLink: () => {} },
      "./PermissionMatrix": { default: Matrix },
      "./AccessInformationPanel": { default: () => null },
      "./styles": {},
    },
    { Error }
  ).default;
  const render = () => {
    state.reset();
    return Component({
      account,
      onSaved: () => assert.fail("Autosave must not close the editor"),
      onCancel: () => {},
      onAccessSaved: (value) => {
        saved.push(value);
        account = value;
      },
    });
  };
  return {
    render,
    calls,
    saved,
    matrix: () => find(render(), (node) => node.type === Matrix),
    find: (predicate) => find(render(), predicate),
  };
}
test("permission edits save immediately, block overlapping writes, and preserve unsaved profile drafts", async () => {
  let confirm;
  const app = editor(
    (id, input) =>
      new Promise((resolve) => {
        confirm = () => resolve({ id, ...input });
      })
  );
  const name = app.find((node) => node.type === "input" && node.props.value === "Staff");
  name.props.onChange({ target: { value: "Unsaved profile draft" } });
  app.matrix().props.onChange({ products: ["view", "edit"] });
  assert.equal(app.calls.length, 1);
  assert.equal(app.calls[0].input.name, "Staff");
  assert.equal(app.matrix().props.disabled, true);
  app.matrix().props.onChange({});
  assert.equal(app.calls.length, 1);
  confirm();
  await flush();
  assert.equal(app.saved.length, 1);
  assert.deepEqual(plain(app.matrix().props.value), { products: ["view", "edit"] });
  assert.ok(app.find((node) => node.type === "input" && node.props.value === "Unsaved profile draft"));
});
test("failed access saves roll back checkmarks and expose the server error", async () => {
  const app = editor(async () => {
    throw Error("Database offline");
  });
  app.matrix().props.onChange({ products: ["view", "edit"] });
  await flush();
  assert.deepEqual(plain(app.matrix().props.value), { products: ["view"] });
  assert.equal(app.saved.length, 0);
  assert.ok(app.find((node) => node.props?.role === "alert" && node.props.children === "Database offline"));
});
test("new-account permissions stay in the draft until the account is created", async () => {
  const app = editor(() => assert.fail("No autosave before creation"), null);
  app.matrix().props.onChange({ products: ["view", "edit"] });
  await flush();
  assert.equal(app.calls.length, 0);
  assert.deepEqual(plain(app.matrix().props.value), { products: ["view", "edit"] });
});
test("active internal sessions refresh promptly, react to permission events, and clean up listeners", async () => {
  let effect, interval, intervalMs, cleanup;
  const events = new Map();
  const documentEvents = new Map();
  const updates = [];
  let user = {
    role: "Admin Internal",
    isInternal: true,
    permissions: { products: ["view"] },
    pageAccess: ["products"],
  };
  let next = { ...user, permissions: { products: ["view", "edit"] } };
  const Sync = load(
    "components/admin/AdminSessionSync.tsx",
    {
      react: {
        useEffect: (fn) => {
          effect = fn;
        },
      },
      "next/navigation": { usePathname: () => "/admin/products" },
      "@/config/siteConfig": { siteConfig: { admin: { sessionKey: "cits_admin_session" } } },
      "@/lib/auth": {
        AdminAuth: {
          getSession: () => ({ user }),
          updateUser: (patch) => {
            user = { ...user, ...patch };
            updates.push(patch);
          },
          logout: () => {
            user = null;
          },
        },
      },
      "@/lib/api": { citsApi: { getMe: async () => ({ success: true, user: next }) } },
    },
    {
      localStorage: { getItem: () => "token" },
      window: {
        setInterval: (fn, ms) => {
          interval = fn;
          intervalMs = ms;
          return 1;
        },
        clearInterval: () => {
          cleanup = true;
        },
        addEventListener: (name, fn) => events.set(name, fn),
        removeEventListener: (name) => events.delete(name),
      },
      document: {
        visibilityState: "visible",
        addEventListener: (name, fn) => documentEvents.set(name, fn),
        removeEventListener: (name) => documentEvents.delete(name),
      },
    }
  ).default;
  Sync();
  const stop = effect();
  await flush();
  assert.deepEqual(plain(user.permissions), { products: ["view", "edit"] });
  assert.equal(intervalMs, 3000);
  next = { ...next, permissions: { products: ["view"] } };
  interval();
  await flush();
  assert.deepEqual(plain(user.permissions), { products: ["view"] });
  next = { ...next, permissions: {} };
  events.get("storage")({ key: "cits_permissions_updated_at" });
  await flush();
  assert.deepEqual(plain(user.permissions), {});
  assert.equal(updates.length, 3);
  stop();
  assert.equal(cleanup, true);
  assert.equal(events.size, 0);
  assert.equal(documentEvents.size, 0);
});

test("every action in all content modules is clickable and remains selected after normalization", () => {
  const state = hooks();
  let value = {};
  const Matrix = load("components/admin/settings/PermissionMatrix.tsx", {
    ...shared,
    react: state.react,
    "./styles": { fieldClass: "" },
  }).default;
  const render = () => {
    state.reset();
    return Matrix({
      value,
      onChange: (next) => {
        value = next;
      },
    });
  };
  for (const page of access.EDITABLE_PAGES) {
    for (const label of ["Lihat", "Tambah", "Edit", "Hapus"]) {
      const button = find(render(), (node) => node.props?.["aria-label"] === label + " " + page.shortLabel);
      assert.ok(button, page.key + ": " + label);
      assert.equal(button.props.disabled, false);
      button.props.onClick();
    }
    assert.deepEqual(plain(value[page.key]), ["view", "create", "edit", "delete"]);
  }
  assert.equal(Object.keys(access.normalizePermissions(value)).length, access.EDITABLE_PAGES.length);
});
