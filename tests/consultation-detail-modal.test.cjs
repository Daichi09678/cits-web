const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { load } = require("./helpers/load.cjs");
const jsx = require("react/jsx-runtime");
const icons = require("lucide-react");
const consultation = load("lib/consultation.ts");
const Details = load("components/admin/MessageConsultationDetails.tsx", {
  "react/jsx-runtime": jsx,
  "lucide-react": icons,
  "@/lib/consultation": consultation,
}).default;
const message = {
  id: "message-1",
  name: "Ir. Hendra Gunawan",
  company: "PT Indonesia Power",
  email: "hendra@example.test",
  phone: "081122334455",
  serviceRequested: "IT Supplier",
  message: "Klarifikasi spesifikasi server rackmount.",
  status: "read",
  dealStage: "diskusi",
  dealNotes: "Jadwalkan pertemuan.",
  createdAt: "2026-10-25T12:32:00Z",
};
const stages = [
  { key: "baru", label: "Baru Masuk" },
  { key: "diskusi", label: "Diskusi" },
  { key: "proses", label: "Penawaran" },
  { key: "kesepakatan", label: "Kesepakatan" },
  { key: "selesai", label: "Selesai" },
  { key: "batal", label: "Dibatalkan" },
];
const settle = () => new Promise((resolve) => setImmediate(resolve));
const nodes = (node) =>
  !React.isValidElement(node) ? [] : [node, ...React.Children.toArray(node.props.children).flatMap(nodes)];
const text = (node) =>
  typeof node === "string" || typeof node === "number"
    ? String(node)
    : React.Children.toArray(node?.props?.children).map(text).join("");
const button = (tree, label) => nodes(tree).find((node) => node.type === "button" && text(node) === label);

function modal(overrides = {}) {
  const states = [];
  const calls = [];
  let cursor = 0,
    id = 0;
  const Component = load("components/admin/ConsultationDetailModal.tsx", {
    react: {
      ...React,
      useEffect() {},
      useId: () => `detail-${id++}`,
      useState(initial) {
        const key = cursor++;
        if (!(key in states)) states[key] = typeof initial === "function" ? initial() : initial;
        return [
          states[key],
          (next) => {
            states[key] = typeof next === "function" ? next(states[key]) : next;
          },
        ];
      },
    },
    "react/jsx-runtime": jsx,
    "lucide-react": icons,
    "./AdminDialogSurface": { default: ({ children }) => React.createElement("div", { role: "dialog" }, children) },
    "./MessageConsultationDetails": { default: Details },
    "@/lib/date": load("lib/date.ts"),
  }).default;
  const props = {
    message,
    stages,
    canEdit: true,
    canDelete: true,
    onClose: () => calls.push("close"),
    onStageChange: (value) => calls.push(["stage", value]),
    onReadStatusChange: (value) => calls.push(["read", value]),
    onSaveNotes: async (value) => calls.push(["notes", value]),
    onReply: () => calls.push("reply"),
    onDelete: () => calls.push("delete"),
    ...overrides,
  };
  return {
    calls,
    props,
    render: () => {
      cursor = 0;
      id = 0;
      return Component(props);
    },
  };
}

test("modal displays real contact/delivery data and only the activity known from the message", () => {
  const app = modal();
  const html = renderToStaticMarkup(app.render());
  for (const value of [
    message.name,
    message.company,
    message.email,
    message.phone,
    message.message,
    "IT Supplier",
    "19.32 WIB",
  ])
    assert.ok(html.includes(value), value);
  assert.match(html, /https:\/\/wa.me\/6281122334455/);
  assert.match(html, /mailto:hendra@example.test/);
  assert.match(html, /Pesan konsultasi diterima/);
  assert.doesNotMatch(html, /Status diubah|Catatan ditambahkan|Balasan dikirim/);
  assert.equal((html.match(/Belum disampaikan oleh pengunjung/g) || []).length, 4);
  assert.equal(
    nodes(app.render()).find((node) => node.props["aria-current"] === "step").props.children[1].props.children,
    "Diskusi"
  );
});

test("stage/read controls remain separate, cancellation is not a normal progress step, and actions stay wired", () => {
  const app = modal();
  const selects = () => nodes(app.render()).filter((node) => node.type === "select");
  assert.equal(selects()[0].props.value, "diskusi");
  assert.equal(selects()[1].props.value, "read");
  selects()[0].props.onChange({ target: { value: "batal" } });
  selects()[1].props.onChange({ target: { value: "replied" } });
  button(app.render(), "Selesai").props.onClick();
  assert.equal(button(app.render(), "Dibatalkan"), undefined);
  button(app.render(), "Kirim Balasan Email").props.onClick();
  button(app.render(), "Hapus Pesan").props.onClick();
  nodes(app.render())
    .find((node) => node.props["aria-label"] === "Tutup detail konsultasi")
    .props.onClick();
  assert.deepEqual(app.calls, [
    ["stage", "batal"],
    ["read", "replied"],
    ["stage", "selesai"],
    "reply",
    "delete",
    "close",
  ]);
  app.props.message = { ...message, dealStage: "batal" };
  assert.match(text(app.render()), /Konsultasi dibatalkan/);
  assert.equal(nodes(app.render()).filter((node) => node.props["aria-current"] === "step").length, 0);
});

test("failed note saves retain the draft, show an error, and allow a confirmed retry", async () => {
  let complete;
  let attempts = 0;
  const app = modal({
    onSaveNotes: (notes) => {
      assert.equal(notes, "Draft catatan baru");
      attempts++;
      return new Promise((resolve, reject) => {
        complete = attempts === 1 ? () => reject(new Error("Offline")) : resolve;
      });
    },
  });
  const textarea = () => nodes(app.render()).find((node) => node.type === "textarea");
  textarea().props.onChange({ target: { value: "Draft catatan baru" } });
  button(app.render(), "Simpan Catatan").props.onClick();
  assert.equal(button(app.render(), "Menyimpan...").props.disabled, true);
  assert.equal(nodes(app.render()).find((node) => node.type === "select").props.disabled, true);
  complete();
  await settle();
  assert.equal(textarea().props.value, "Draft catatan baru");
  assert.ok(nodes(app.render()).find((node) => node.props.role === "alert"));
  button(app.render(), "Simpan Catatan").props.onClick();
  complete();
  await settle();
  assert.match(text(app.render()), /Catatan berhasil disimpan/);
  assert.equal(textarea().props.value, "Draft catatan baru");
});

test("read-only users cannot edit status, notes, or delete, and catalog snapshots remain accessible", () => {
  const app = modal({ canEdit: false, canDelete: false });
  for (const node of nodes(app.render()).filter((node) => node.type === "select" || node.type === "textarea"))
    assert.equal(node.props.disabled, true);
  for (const label of ["Simpan Catatan", "Hapus Pesan", "Kirim Balasan Email", "Penawaran"])
    assert.equal(button(app.render(), label).props.disabled, true);
  const longText = "Kebutuhan spesifikasi yang panjang. ".repeat(100);
  const rich = {
    ...message,
    message: longText,
    consultation: {
      source: "products",
      purpose: "quotation",
      expectedOutcome: "Target integrasi",
      currentSystem: "Sistem lama",
      timeline: "Desember",
      usageEstimate: "50 pengguna",
      requestedFeatures: ["Migrasi data"],
      service: {
        id: "service",
        title: "Snapshot layanan",
        description: "Deskripsi saat dikirim",
        features: ["Dukungan onsite"],
        sla: "8 jam",
        techStack: ["Linux"],
        deliverables: [{ label: "Dokumen", description: "Rincian pekerjaan" }],
      },
      product: {
        id: "product",
        name: "Snapshot produk",
        description: "Produk tersimpan",
        features: ["Ketersediaan tinggi"],
        tags: ["Enterprise"],
      },
      portfolio: {
        id: "reference",
        title: "Proyek referensi",
        client: "Instansi",
        servicePillar: "Software",
        challenge: "Tantangan",
        solution: "Solusi",
        scopeOfWork: ["Ruang lingkup"],
      },
    },
  };
  const html = renderToStaticMarkup(React.createElement(Details, { message: rich }));
  for (const value of [
    longText,
    "Target integrasi",
    "Sistem lama",
    "Desember",
    "50 pengguna",
    "Migrasi data",
    "Snapshot layanan",
    "Snapshot produk",
    "Dokumen",
    "Rincian pekerjaan",
    "Linux",
    "Enterprise",
    "Proyek referensi",
    "Ruang lingkup",
  ])
    assert.ok(html.includes(value), value);
  assert.match(html, /<details[^>]*><summary[^>]*>Rincian Katalog Saat Pesan Dikirim/);
  const empty = renderToStaticMarkup(
    React.createElement(Details, { message: { ...message, message: "", consultation: { expectedOutcome: " " } } })
  );
  assert.equal((empty.match(/Belum disampaikan oleh pengunjung/g) || []).length, 5);
});

test("native dialog lifecycle supplies modal focus handling and respects Escape and backdrop dismissal", () => {
  let effect;
  const calls = [];
  const dialog = { showModal: () => calls.push("open"), close: () => calls.push("close") };
  class FocusTarget {
    isConnected = true;
    focus() {
      calls.push("restore-focus");
    }
  }
  const Surface = load(
    "components/admin/AdminDialogSurface.tsx",
    {
      react: {
        useEffect: (callback) => {
          effect = callback;
        },
        useRef: () => ({ current: dialog }),
      },
      "react/jsx-runtime": jsx,
    },
    { document: { activeElement: new FocusTarget() }, HTMLElement: FocusTarget }
  ).default;
  const tree = Surface({
    labelledBy: "test-title",
    onClose: () => calls.push("dismiss"),
    children: "Content",
    initialFocusRef: { current: { focus: () => calls.push("focus-cancel") } },
  });
  assert.equal(tree.type, "dialog");
  assert.equal(tree.props["aria-labelledby"], "test-title");
  const cleanup = effect();
  tree.props.onCancel({ preventDefault: () => calls.push("prevent") });
  const target = { getBoundingClientRect: () => ({ left: 20, top: 20, right: 100, bottom: 100 }) };
  tree.props.onClick({ target, currentTarget: target, clientX: 40, clientY: 40 });
  tree.props.onClick({ target, currentTarget: target, clientX: 0, clientY: 0 });
  cleanup();
  assert.deepEqual(calls, ["open", "focus-cancel", "prevent", "dismiss", "dismiss", "close", "restore-focus"]);
});
