const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { load } = require("./helpers/load.cjs");
const initial = load("data/initialData.ts");
const access = load("lib/internalAccess.ts");
const client = { id: "client-1", name: "Mitra tersimpan", category: "Swasta", logo: "/logo.webp", isActive: true };
const event = () => ({ preventDefault() {}, stopPropagation() {} });

function mount({ permissions = ["view", "create", "edit", "delete"], actions = {}, confirm = async () => true } = {}) {
  const state = [];
  const refs = [];
  let cursor = 0;
  let refCursor = 0;
  const Component = load(
    "app/(admin)/admin/landing/page.tsx",
    {
      react: {
        useEffect() {},
        useRef: (value) => (refs[refCursor++] ??= { current: value }),
        useState: (initial) => {
          const index = cursor++;
          if (!(index in state)) state[index] = typeof initial === "function" ? initial() : initial;
          return [
            state[index],
            (next) => {
              state[index] = typeof next === "function" ? next(state[index]) : next;
            },
          ];
        },
      },
      "react/jsx-runtime": require("react/jsx-runtime"),
      "react-dom": { createPortal: (node) => node },
      "next/link": { default: () => null },
      "next/image": { default: () => null },
      "lucide-react": require("lucide-react"),
      "@/components/pages/admin/AdminTopbar": { default: () => null },
      "@/components/pages/admin/AdminDialogSurface": {
        default: ({ children }) => React.createElement("div", null, children),
      },
      "@/components/pages/admin/AdminDialogProvider": {
        useAdminDialog: () => ({ confirm, alert: () => assert.fail("Client mutations use inline status") }),
      },
      "@/lib/auth": {
        useAdminAuth: () => ({ session: { user: { role: "Admin Internal", permissions: { clients: permissions } } } }),
      },
      "@/lib/internalAccess": access,
      "@/data/initialData": initial,
      "@/lib/focusContent": load("lib/focusContent.ts"),
      "@/stores/citsStore": {
        useCitsStore: () => ({
          landingData: initial.initialLandingPageData,
          clients: [client],
          aboutData: initial.initialAboutData,
          actions,
        }),
      },
    },
    { Error, document: { body: {} } }
  ).default;
  const render = () => {
    cursor = 0;
    refCursor = 0;
    return Component();
  };
  function nodes(node = render(), result = []) {
    if (!node || typeof node !== "object") return result;
    result.push(node);
    for (const child of React.Children.toArray(node.props?.children)) nodes(child, result);
    return result;
  }
  const find = (predicate) => nodes().find(predicate);
  find((node) => node.props.title === "Buka pengaturan section Mitra & Klien").props.onClick();
  const add = () => find((node) => node.props.onClick?.name === "openAddClientModal");
  const form = () => find((node) => node.props.onSubmit?.name === "handleSaveClient");
  const name = () => find((node) => node.props.placeholder === "cth. Kementerian Perhubungan RI");
  return { nodes, find, add, form, name };
}

test("landing waits for client save confirmation and blocks duplicate requests before rerender", async () => {
  let resolve;
  let calls = 0;
  const app = mount({
    actions: {
      addClient: () => {
        calls++;
        return new Promise((done) => {
          resolve = done;
        });
      },
    },
  });
  app.add().props.onClick();
  app.name().props.onChange({ target: { value: "Mitra baru" } });
  const submit = app.form().props.onSubmit;
  const pending = submit(event());
  await submit(event());
  assert.equal(calls, 1);
  assert.ok(app.form());
  assert.equal(app.find((node) => node.type === "button" && node.props["aria-busy"] === true).props.disabled, true);
  assert.equal(
    app.find((node) => node.props.role === "status"),
    undefined
  );
  resolve();
  await pending;
  assert.equal(app.form(), undefined);
  assert.ok(app.find((node) => node.props.role === "status"));
});

test("failed client save preserves the draft and allows retry without reporting success", async () => {
  let calls = 0;
  const app = mount({
    actions: {
      updateClient: async () => {
        if (++calls === 1) throw new Error("Server tidak tersedia");
      },
    },
  });
  app.find((node) => node.props.title === "Edit kementerian / foto").props.onClick();
  app.name().props.onChange({ target: { value: "Perubahan belum tersimpan" } });
  await app.form().props.onSubmit(event());
  assert.equal(app.name().props.value, "Perubahan belum tersimpan");
  assert.equal(app.find((node) => node.props.role === "alert").props.children, "Server tidak tersedia");
  assert.equal(
    app.find((node) => node.props.role === "status"),
    undefined
  );
  await app.form().props.onSubmit(event());
  assert.equal(app.form(), undefined);
  assert.ok(app.find((node) => node.props.role === "status"));
});

test("client actions follow individual create, edit and delete permissions", () => {
  for (const permissions of [[], ["view"], ["view", "create"], ["view", "edit"], ["view", "delete"]]) {
    const app = mount({ permissions });
    assert.equal(Boolean(app.add()), permissions.includes("create"));
    assert.equal(
      Boolean(app.find((node) => node.props.title === "Edit kementerian / foto")),
      permissions.includes("edit")
    );
    assert.equal(Boolean(app.find((node) => node.props.title === "Hapus kementerian")), permissions.includes("delete"));
  }
});

test("client deletion waits for confirmation and server result, catches failure, and supports cancellation", async () => {
  let resolveConfirm;
  let rejectDelete;
  let calls = 0;
  const app = mount({
    confirm: () =>
      new Promise((resolve) => {
        resolveConfirm = resolve;
      }),
    actions: {
      deleteClient: () => {
        calls++;
        return new Promise((_resolve, reject) => {
          rejectDelete = reject;
        });
      },
    },
  });
  const remove = app.find((node) => node.props.title === "Hapus kementerian").props.onClick;
  const pending = remove();
  await remove();
  assert.equal(calls, 0);
  assert.equal(app.add().props.disabled, false);
  resolveConfirm(true);
  await new Promise(setImmediate);
  assert.equal(calls, 1);
  assert.equal(
    app.find((node) => node.props.role === "status"),
    undefined
  );
  rejectDelete(new Error("Hapus gagal"));
  await pending;
  assert.equal(app.find((node) => node.props.role === "alert").props.children, "Hapus gagal");
  const cancelled = app.find((node) => node.props.title === "Hapus kementerian").props.onClick();
  resolveConfirm(false);
  await cancelled;
  assert.equal(calls, 1);
  assert.equal(
    app.find((node) => node.props.role === "status"),
    undefined
  );
});

test("switching landing sections preserves unsaved text in the extracted panels", () => {
  const app = mount();
  const openHero = () =>
    app.find((node) => node.props.title === "Buka pengaturan section Hero & Headline").props.onClick();
  openHero();
  app
    .find((node) => node.type === "input" && node.props.value === initial.initialLandingPageData.hero.headlinePrefix)
    .props.onChange({ target: { value: "Judul belum disimpan" } });
  app.find((node) => node.props.title === "Buka pengaturan section Mitra & Klien").props.onClick();
  assert.ok(app.add());
  openHero();
  assert.ok(app.find((node) => node.type === "input" && node.props.value === "Judul belum disimpan"));
});

test("successful client deletion reports success only after the server confirms it", async () => {
  let complete;
  const app = mount({
    actions: {
      deleteClient: () =>
        new Promise((resolve) => {
          complete = resolve;
        }),
    },
  });
  const pending = app.find((node) => node.props.title === "Hapus kementerian").props.onClick();
  await new Promise(setImmediate);
  assert.equal(
    app.find((node) => node.props.role === "status"),
    undefined
  );
  assert.equal(app.add().props.disabled, true);
  complete();
  await pending;
  assert.ok(app.find((node) => node.props.role === "status"));
  assert.equal(app.add().props.disabled, false);
});
