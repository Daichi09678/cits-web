const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { load } = require("./helpers/load.cjs");
const jsx = require("react/jsx-runtime");
const Surface = () => null;

function nodes(node, result = []) {
  if (!node || typeof node !== "object") return result;
  result.push(node);
  for (const child of React.Children.toArray(node.props?.children)) nodes(child, result);
  return result;
}

function provider() {
  const state = [];
  const refs = [];
  let cursor = 0;
  let refCursor = 0;
  let id = 0;
  const Component = load("components/pages/admin/AdminDialogProvider.tsx", {
    react: {
      createContext: React.createContext,
      useCallback: (fn) => fn,
      useMemo: (fn) => fn(),
      useId: () => `dialog-${id++}`,
      useRef: (value) => (refs[refCursor++] ??= { current: value }),
      useState: (initial) => {
        const index = cursor++;
        if (!(index in state)) state[index] = initial;
        return [
          state[index],
          (next) => {
            state[index] = typeof next === "function" ? next(state[index]) : next;
          },
        ];
      },
    },
    "react/jsx-runtime": jsx,
    "lucide-react": require("lucide-react"),
    "./AdminDialogSurface": { default: Surface },
  }).default;
  const render = () => {
    cursor = 0;
    refCursor = 0;
    id = 0;
    return Component({ children: "Page content" });
  };
  const find = (predicate) => nodes(render()).find(predicate);
  return { render, find, api: () => render().props.value, surface: () => find((node) => node.type === Surface) };
}

test("ordinary and detailed confirmations use the native surface, focus Cancel and resolve the chosen result", async () => {
  for (const details of [undefined, React.createElement("p", null, "Catalog details")]) {
    const app = provider();
    const pending = app.api().confirm({ title: "Hapus mitra?", description: "Perubahan permanen", details });
    const surface = app.surface();
    assert.ok(surface);
    const cancel = app.find((node) => node.type === "button" && node.props.children === "Batal");
    assert.equal(surface.props.initialFocusRef, cancel.props.ref);
    assert.ok(app.find((node) => node.props.id === surface.props.labelledBy));
    assert.ok(app.find((node) => node.props.id === surface.props.describedBy));
    surface.props.onClose();
    assert.equal(await pending, false);
    assert.equal(app.surface(), undefined);
    const approved = app.api().confirm({ title: "Konfirmasi", confirmLabel: "Setuju" });
    app.find((node) => node.type === "button" && node.props.children === "Setuju").props.onClick();
    assert.equal(await approved, true);
  }
});

test("alerts focus their acknowledgement and finish when dismissed", async () => {
  const app = provider();
  const pending = app.api().alert({ title: "Tersimpan" });
  const acknowledge = app.find((node) => node.type === "button" && node.props.children === "Mengerti");
  assert.equal(app.surface().props.initialFocusRef, acknowledge.props.ref);
  acknowledge.props.onClick();
  await pending;
  assert.equal(app.surface(), undefined);
});

test("busy native dialogs prevent Escape and backdrop dismissal without losing their accessible description", () => {
  let closes = 0;
  let prevented = 0;
  const Native = load("components/pages/admin/AdminDialogSurface.tsx", {
    react: { useRef: () => ({ current: null }), useEffect() {} },
    "react/jsx-runtime": jsx,
  }).default;
  const props = {
    labelledBy: "title",
    describedBy: "description",
    busy: true,
    onClose: () => closes++,
    children: "Saving",
  };
  const tree = Native(props);
  assert.equal(tree.type, "dialog");
  assert.equal(tree.props["aria-busy"], true);
  assert.equal(tree.props["aria-describedby"], "description");
  const target = { getBoundingClientRect: () => ({ left: 20, top: 20, right: 100, bottom: 100 }) };
  const outside = { target, currentTarget: target, clientX: 0, clientY: 0 };
  tree.props.onCancel({ preventDefault: () => prevented++ });
  tree.props.onClick(outside);
  assert.equal(prevented, 1);
  assert.equal(closes, 0);
  Native({ ...props, busy: false }).props.onClick(outside);
  assert.equal(closes, 1);
});

test("shared modal cleanup restores a connected trigger and safely ignores a removed trigger", () => {
  for (const isConnected of [true, false]) {
    let effect;
    const calls = [];
    class Trigger {
      isConnected = isConnected;
      focus() {
        calls.push("restore");
      }
    }
    const Native = load(
      "components/pages/admin/AdminDialogSurface.tsx",
      {
        react: {
          useEffect: (fn) => {
            effect = fn;
          },
          useRef: () => ({ current: { showModal: () => calls.push("open"), close: () => calls.push("close") } }),
        },
        "react/jsx-runtime": jsx,
      },
      { document: { activeElement: new Trigger() }, HTMLElement: Trigger }
    ).default;
    Native({ labelledBy: "title", onClose() {}, children: "Dialog" });
    effect()();
    assert.deepEqual(calls, isConnected ? ["open", "close", "restore"] : ["open", "close"]);
  }
});

test("product, settings and team dialog wrappers forward busy state and titles to the same surface", () => {
  const imports = {
    react: { useId: () => "wrapper-title" },
    "react/jsx-runtime": jsx,
    "react-dom": { createPortal: (node) => node },
    "lucide-react": require("lucide-react"),
    "./AdminDialogSurface": { default: Surface },
    "@/components/pages/admin/AdminDialogSurface": { default: Surface },
    "./typography": { settingsFont: { className: "settings-font" } },
  };
  for (const path of [
    "components/pages/admin/AdminModal.tsx",
    "components/admin/settings/SettingsDialog.tsx",
    "components/admin/team/TeamDialog.tsx",
  ]) {
    const Component = load(path, imports, { document: { body: {} } }).default;
    const tree = Component({
      open: true,
      title: "Editor",
      titleId: "team-title",
      description: "Details",
      busy: true,
      children: "Form",
      onClose() {},
    });
    assert.equal(tree.type, Surface);
    assert.equal(tree.props.busy, true);
    assert.ok(nodes(tree).find((node) => node.props.id === tree.props.labelledBy));
    assert.equal(nodes(tree).find((node) => node.type === "button").props.disabled, true);
  }
});
