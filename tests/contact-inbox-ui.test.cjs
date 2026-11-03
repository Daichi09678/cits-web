const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { load } = require("./helpers/load.cjs");

const message = {
  id: "inbox-1",
  name: "Dian Permatasari",
  email: "dian@example.test",
  phone: "08123456789",
  company: "Kementerian ESDM",
  serviceRequested: "IT Consultant",
  message: "Mohon jadwal konsultasi.",
  status: "unread",
  createdAt: "2026-11-03T01:00:00Z",
};
const shared = {
  "react/jsx-runtime": require("react/jsx-runtime"),
  "lucide-react": require("lucide-react"),
  "@/lib/consultation": load("lib/consultation.ts"),
  "@/lib/date": load("lib/date.ts"),
};

function harness(file, overrides = {}, globals = {}) {
  const values = [];
  let cursor = 0;
  const component = load(
    file,
    {
      ...shared,
      react: {
        ...React,
        useEffect() {},
        useRef: (value) => ({ current: value }),
        useState(initial) {
          const index = cursor++;
          if (!(index in values)) values[index] = typeof initial === "function" ? initial() : initial;
          return [
            values[index],
            (next) => {
              values[index] = typeof next === "function" ? next(values[index]) : next;
            },
          ];
        },
      },
      ...overrides,
    },
    globals
  ).default;
  return (props = {}) => {
    cursor = 0;
    return component(props);
  };
}

function nodes(node) {
  if (!React.isValidElement(node)) return [];
  return [node, ...React.Children.toArray(node.props.children).flatMap(nodes)];
}
const find = (tree, predicate) => nodes(tree).find(predicate);
const text = (node) =>
  typeof node === "string" || typeof node === "number"
    ? String(node)
    : React.Children.toArray(node?.props?.children).map(text).join("");
const button = (tree, label) => find(tree, (node) => node.type === "button" && text(node) === label);

test("inbox rows retain sender data, consultation content, selection, and every message action", () => {
  const calls = [];
  const render = harness("components/admin/ContactInboxRow.tsx");
  const props = {
    message,
    selected: false,
    canEdit: true,
    canDelete: true,
    stages: [
      { key: "baru", label: "Baru Masuk" },
      { key: "diskusi", label: "Diskusi" },
    ],
    onSelect: () => calls.push("select"),
    onOpen: () => calls.push("open"),
    onReply: () => calls.push("reply"),
    onDelete: () => calls.push("delete"),
    onStageChange: (value) => calls.push(value),
  };
  const tree = () => render(props);
  const html = renderToStaticMarkup(tree());
  for (const value of [message.name, message.email, message.phone, message.company, message.message, "IT Consultant"])
    assert.ok(html.includes(value), value);
  assert.match(html, /belum dibaca/);
  assert.match(html, /datetime="2026-11-03T01:00:00Z"/i);
  find(tree(), (node) => node.type === "input").props.onChange();
  button(tree(), "Buka").props.onClick();
  button(tree(), "Balas Email").props.onClick();
  button(tree(), "Baru Masuk").props.onClick();
  button(tree(), "Diskusi").props.onClick();
  find(tree(), (node) => node.props["aria-label"]?.startsWith("Aksi lainnya")).props.onClick();
  button(tree(), "Hapus pesan").props.onClick();
  assert.deepEqual(calls, ["select", "open", "reply", "diskusi", "delete"]);
  props.canEdit = false;
  props.canDelete = false;
  assert.equal(button(tree(), "Baru Masuk").props.disabled, true);
  find(tree(), (node) => node.props["aria-label"]?.startsWith("Aksi lainnya")).props.onClick();
  assert.equal(button(tree(), "Hapus pesan").props.disabled, true);
});

function inbox() {
  const Row = () => null;
  const Topbar = () => null;
  const calls = [];
  const actions = new Proxy(
    {},
    {
      get:
        (_, key) =>
        (...args) => {
          calls.push([key, ...args]);
        },
    }
  );
  const render = harness(
    "app/(admin)/admin/contact/page.tsx",
    {
      "@/components/admin/ContactInboxRow": { default: Row },
      "@/components/admin/ConsultationDetailModal": { default: () => null },
      "@/components/admin/AdminDialogSurface": { default: () => null },
      "@/components/admin/AdminTopbar": { default: Topbar },
      "@/components/admin/Pagination": { default: () => null },
      "@/components/admin/AdminDialogProvider": { useAdminDialog: () => ({ alert() {} }) },
      "@/lib/auth": { useAdminAuth: () => ({ session: { user: { role: "Super Admin" } } }) },
      "@/lib/internalAccess": load("lib/internalAccess.ts"),
      "@/lib/audio": { playNewMessageSound() {} },
      "@/config/inbox": { getMessageRetentionDays: () => 30 },
      "@/stores/citsStore": {
        useCitsStore: () => ({
          contactInfo: { address: "Jakarta", phone: "021123", email: "info@example.test", workingHours: "09–17" },
          messages: [
            message,
            {
              ...message,
              id: "inbox-2",
              name: "Hendra",
              serviceRequested: "IT Supplier",
              dealStage: "diskusi",
              status: "read",
            },
          ],
          isLiveConnected: true,
          actions,
        }),
      },
    },
    { setTimeout() {} }
  );
  return {
    render,
    calls,
    rows: () => nodes(render()).filter((node) => node.type === Row),
    search: (value) =>
      find(
        render(),
        (node) => node.type === "input" && node.props["aria-label"] === "Cari pesan konsultasi"
      ).props.onChange({ target: { value } }),
  };
}

test("inbox search composes with consultation stage and read-status filters", () => {
  const app = inbox();
  assert.equal(app.rows().length, 2);
  app.search("IT Supplier");
  assert.deepEqual(
    app.rows().map((row) => row.props.message.id),
    ["inbox-2"]
  );
  app.search("");
  button(app.render(), "Baru Masuk1").props.onClick();
  assert.deepEqual(
    app.rows().map((row) => row.props.message.id),
    ["inbox-1"]
  );
  button(app.render(), "Semua (2)").props.onClick();
  find(app.render(), (node) => node.type === "select" && node.props.id === "inbox-read-filter").props.onChange({
    target: { value: "read" },
  });
  assert.deepEqual(
    app.rows().map((row) => row.props.message.id),
    ["inbox-2"]
  );
});

test("row callbacks and bulk selection still invoke the existing store actions", () => {
  const app = inbox();
  app.rows()[0].props.onStageChange("diskusi");
  assert.deepEqual(app.calls.pop(), ["updateMessageStage", "inbox-1", "diskusi"]);
  app.rows()[0].props.onOpen();
  assert.deepEqual(app.calls.pop(), ["updateMessageStatus", "inbox-1", "read"]);
  app.rows()[0].props.onSelect();
  button(app.render(), "Tandai Dibaca").props.onClick();
  assert.deepEqual(app.calls.pop(), ["updateMessageStatus", "inbox-1", "read"]);
  app.rows()[1].props.onReply();
  assert.match(text(app.render()), /Hendra|Balas|Email/);
  app.rows()[0].props.onDelete();
  assert.match(text(app.render()), /Hapus Pesan/);
  button(app.render(), "Info Kontak").props.onClick();
  assert.match(text(app.render()), /Pengaturan Informasi Kontak/);
  button(app.render(), "Kelola FAQ & Layanan").props.onClick();
  assert.match(text(app.render()), /FAQ/);
});
