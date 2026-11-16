const { test } = require("node:test");
const assert = require("node:assert/strict");
const { load } = require("./helpers/load.cjs");

function mount(extra = {}) {
  const state = [];
  const refs = [];
  const effects = [];
  const changes = [];
  let cursor = 0;
  let refCursor = 0;
  let focused = 0;
  const Component = load(
    "components/pages/public/PublicSelect.tsx",
    {
      react: {
        useId: () => "select-test",
        useRef: (value) => (refs[refCursor++] ??= { current: value }),
        useEffect: (callback) => effects.push(callback),
        useState: (initial) => {
          const index = cursor++;
          if (!(index in state)) state[index] = initial;
          return [
            state[index],
            (value) => {
              state[index] = value;
            },
          ];
        },
      },
      "react/jsx-runtime": require("react/jsx-runtime"),
      "react-dom": { createPortal: (child) => child },
      "lucide-react": require("lucide-react"),
      "./PublicSelect.module.css": { default: {} },
    },
    {
      document: { body: {}, addEventListener() {}, removeEventListener() {} },
      window: { innerWidth: 390, innerHeight: 800, addEventListener() {}, removeEventListener() {} },
    }
  ).default;
  const render = () => {
    cursor = 0;
    refCursor = 0;
    effects.length = 0;
    return Component({
      options: ["Arsip", "Aset", "Konsultasi"],
      value: "Arsip",
      onChange: (value) => changes.push(value),
      ...extra,
    });
  };
  const button = () => render().props.children[0];
  render();
  refs[0].current = {
    focus: () => focused++,
    getBoundingClientRect: () => ({ left: 20, top: 650, bottom: 696, width: 350 }),
  };
  const key = (key) => button().props.onKeyDown({ key, preventDefault() {} });
  return { render, button, key, changes, effects, focused: () => focused };
}

test("public dropdown opens, navigates, selects and restores trigger focus without submitting its form", () => {
  const app = mount();
  assert.equal(app.button().props.type, "button");
  app.button().props.onClick();
  assert.equal(app.button().props["aria-expanded"], true);
  app.key("ArrowDown");
  app.key("Enter");
  assert.deepEqual(app.changes, ["Aset"]);
  assert.equal(app.button().props["aria-expanded"], false);
  assert.equal(app.focused(), 1);
  app.key("End");
  app.key("Escape");
  assert.equal(app.button().props["aria-expanded"], false);
  assert.deepEqual(app.changes, ["Aset"]);
});

test("public dropdown supports typing, pointer selection, blur and disabled dependent filters", () => {
  const app = mount();
  app.key("k");
  const panel = app.render().props.children[1];
  assert.equal(panel.props.children[2].props["data-active"], true);
  panel.props.children[2].props.onClick();
  assert.deepEqual(app.changes, ["Konsultasi"]);
  app.button().props.onClick();
  app.button().props.onBlur();
  assert.equal(app.button().props["aria-expanded"], false);
  assert.equal(mount({ disabled: true }).button().props.disabled, true);
  assert.equal(mount({ options: [] }).button().props.disabled, true);
});

test("dropdown near the bottom opens above its trigger and fits a phone viewport", () => {
  const app = mount();
  app.button().props.onClick();
  app.render();
  const cleanup = app.effects[0]();
  const panel = app.render().props.children[1];
  assert.equal(panel.props.style.position, "fixed");
  assert.equal(panel.props.style.bottom, 156);
  assert.equal(panel.props.style.left, 20);
  assert.equal(panel.props.style.width, 350);
  assert.equal(panel.props.style.maxHeight, 300);
  cleanup();
});
