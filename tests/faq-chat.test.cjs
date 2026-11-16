const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { load } = require("./helpers/load.cjs");

function mount() {
  const state = [];
  const refs = [];
  let cursor = 0;
  let refCursor = 0;
  const Component = load("components/pages/contact/FaqChat.tsx", {
    react: {
      useEffect() {},
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
    "react/jsx-runtime": require("react/jsx-runtime"),
    "lucide-react": require("lucide-react"),
    "@/components/ui/SpotlightCard": { default: ({ children }) => React.createElement("div", null, children) },
    "./FaqChat.module.css": { default: {} },
  }).default;
  const render = () => {
    cursor = 0;
    refCursor = 0;
    return Component({ faqs: [{ question: "Apa SLA?", answer: "Ketentuan dukungan sesuai perjanjian." }] });
  };
  function find(predicate, node = render()) {
    if (!node || typeof node !== "object") return;
    if (predicate(node)) return node;
    for (const child of React.Children.toArray(node.props?.children)) {
      const match = find(predicate, child);
      if (match) return match;
    }
  }
  return { render, find, html: () => renderToStaticMarkup(render()) };
}

test("FAQ removes presence and typing simulation while preserving preset answers, including short questions", () => {
  const app = mount();
  assert.doesNotMatch(app.html(), /Aktif|sedang menulis|Tanya Asisten/);
  app.find((node) => node.type === "button" && node.props.type === "button").props.onClick();
  assert.match(app.html(), /Ketentuan dukungan sesuai perjanjian/);
  assert.match(app.html(), /Pertanyaan Anda/);
});

test("FAQ provides preset questions without a free-text chat form or send button", () => {
  const app = mount();
  assert.doesNotMatch(app.html(), /<form|<input|<textarea|Kirim pertanyaan|ketik topik/i);
  assert.match(app.html(), /Pilih salah satu pertanyaan/);
  assert.doesNotMatch(app.html(), /Ingin membahas kebutuhan khusus|Isi formulir konsultasi/);
});
