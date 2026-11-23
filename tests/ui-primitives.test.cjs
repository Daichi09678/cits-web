const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { load } = require("./helpers/load.cjs");

const cnModule = load("lib/cn.ts");
const cn = cnModule.cn;
const runtime = { "react/jsx-runtime": require("react/jsx-runtime"), "@/lib/cn": cnModule };
const { default: Badge, BackOfficeBadge } = load("components/ui/Badge.tsx", runtime);
const { default: Button, BackOfficeButton } = load("components/ui/Button.tsx", runtime);
const inputModule = load("components/ui/Input.tsx", runtime);
const Input = inputModule.default;
const Textarea = inputModule.Textarea;
const Select = load("components/ui/Select.tsx", {
  ...runtime,
  "./Input": inputModule,
  "lucide-react": require("lucide-react"),
}).default;
const FieldLabel = load("components/ui/FieldLabel.tsx", runtime).default;
const FormFeedback = load("components/ui/FormFeedback.tsx", runtime).default;

const html = (element) => renderToStaticMarkup(element);

test("cn joins only truthy values", () => {
  assert.equal(cn("a", false, undefined, null, "b"), "a b");
});

test("badge applies tone, variant, size and shape from props instead of ad-hoc classes", () => {
  const soft = html(React.createElement(Badge, null, "Aktif"));
  assert.match(soft, /bg-slate-100/);
  assert.match(soft, /rounded-full/);
  assert.match(soft, /text-\[10px\]/);

  const accent = html(React.createElement(Badge, { tone: "accent", variant: "solid", size: "md" }, "3 Baru"));
  assert.match(accent, /bg-action text-on-action/);
  assert.match(accent, /text-\[11px\]/);
  assert.doesNotMatch(accent, /border-orange-200/);

  const inverse = html(React.createElement(Badge, { variant: "inverse" }, "menu aktif"));
  assert.match(inverse, /bg-white text-slate-950/);

  const rounded = html(React.createElement(Badge, { shape: "rounded", tone: "success" }, "Superadmin"));
  assert.match(rounded, /rounded-md/);
  assert.doesNotMatch(rounded, /rounded-full/);
  assert.match(rounded, /bg-emerald-50/);
});

test("badge keeps caller layout classes while owning its colour palette", () => {
  const markup = html(React.createElement(Badge, { tone: "accent", className: "animate-pulse shrink-0" }, "1 Baru"));
  assert.match(markup, /animate-pulse/);
  assert.match(markup, /shrink-0/);
  assert.match(markup, /bg-orange-50/);
});

test("button defaults to a non-submitting type and exposes variant and size tokens", () => {
  const primary = html(React.createElement(Button, null, "Simpan"));
  assert.match(primary, /type="button"/);
  assert.match(primary, /bg-action text-on-action/);
  assert.match(primary, /min-h-11/);
  assert.match(primary, /px-3\.5 py-2\.5 text-xs/);

  const danger = html(
    React.createElement(Button, { variant: "danger-soft", size: "lg", type: "submit", disabled: true }, "Keluar")
  );
  assert.match(danger, /type="submit"/);
  assert.match(danger, /hover:bg-rose-50/);
  assert.match(danger, /px-5 py-3 text-sm/);
  assert.match(danger, /disabled=""/);
});

test("busy buttons announce progress, disable repeat submission and preserve their idle label", () => {
  const busy = html(React.createElement(Button, { busy: true, busyLabel: "Menyimpan...", type: "submit" }, "Simpan"));
  assert.match(busy, /aria-busy="true"/);
  assert.match(busy, /disabled=""/);
  assert.match(busy, /Menyimpan\.\.\./);
  assert.match(busy, /motion-reduce:animate-none/);
  assert.doesNotMatch(busy, /busyLabel=| busy="|>Simpan</);
  assert.match(html(React.createElement(Button, null, "Simpan")), />Simpan</);
});

test("Back Office actions and active badges use the local orange palette with high-contrast styles", () => {
  const button = html(React.createElement(BackOfficeButton, null, "Simpan"));
  assert.match(button, /bg-accent text-white contrast-more:bg-orange-800/);
  const badge = html(React.createElement(BackOfficeBadge, { variant: "inverse" }, "5 Aktif"));
  assert.match(badge, /bg-white\/20 text-white contrast-more:bg-white contrast-more:text-orange-950/);
});

test("public and custom buttons use the shared component without losing their attributes", () => {
  const publicButton = html(React.createElement(Button, { variant: "public-primary", type: "submit" }, "Kirim"));
  assert.match(publicButton, /public-accent-action/);
  assert.match(publicButton, /type="submit"/);

  const custom = html(
    React.createElement(
      Button,
      { variant: "unstyled", size: "none", className: "custom-button", "aria-busy": true },
      "Filter"
    )
  );
  assert.match(custom, /min-h-6 min-w-6/);
  assert.match(custom, /focus-visible:outline-2/);
  assert.match(custom, /custom-button"/);
  assert.match(custom, /aria-busy="true"/);
});

test("field labels stay associated with their controls and feedback announces errors and confirmed status", () => {
  const label = html(React.createElement(FieldLabel, { htmlFor: "email", required: true }, "Email"));
  assert.match(label, /for="email"/);
  assert.match(label, /aria-hidden="true"/);
  assert.match(label, /\*/);
  const error = html(React.createElement(FormFeedback, { id: "email-error" }, "Periksa alamat email."));
  assert.match(error, /role="alert"/);
  assert.match(error, /aria-atomic="true"/);
  assert.match(error, /Periksa alamat email/);
  const success = html(React.createElement(FormFeedback, { tone: "success" }, "Data tersimpan."));
  assert.match(success, /role="status"/);
  assert.doesNotMatch(success, /role="alert"/);
});

test("form controls share one base style and only differ by field size", () => {
  const md = html(React.createElement(Input, { placeholder: "Nama", name: "nama" }));
  assert.match(md, /py-3 text-sm/);
  assert.match(md, /rounded-xl/);
  assert.match(md, /focus:ring-2 focus:ring-orange-700/);

  const sm = html(React.createElement(Input, { fieldSize: "sm", withIcon: true, name: "email" }));
  assert.match(sm, /py-2\.5 text-xs/);
  assert.match(sm, /pl-10/);

  const invalid = html(React.createElement(Input, { invalid: true, name: "telp" }));
  assert.match(invalid, /border-rose-700/);
  assert.match(invalid, /aria-invalid="true"/);
  assert.match(html(React.createElement(Input, { invalid: true, "aria-invalid": false })), /aria-invalid="true"/);

  const area = html(React.createElement(Textarea, { name: "pesan", fieldSize: "sm" }));
  assert.match(area, /min-h-\[7\.5rem\]/);
  assert.match(area, /py-2\.5 text-xs/);
  const compact = html(React.createElement(Textarea, { rows: 2, "aria-describedby": "hint" }));
  assert.match(compact, /rows="2"/);
  assert.match(compact, /aria-describedby="hint"/);
  assert.doesNotMatch(compact, /min-h-\[7\.5rem\]/);
  assert.match(html(React.createElement(Textarea, { withIcon: true })), /pl-10/);
});

test("select renders native options with the shared chevron affordance", () => {
  const markup = html(
    React.createElement(
      Select,
      { name: "kategori", defaultValue: "b", "aria-label": "Kategori" },
      React.createElement("option", { value: "a" }, "A"),
      React.createElement("option", { value: "b" }, "B")
    )
  );
  assert.match(markup, /<select/);
  assert.match(markup, /appearance-none/);
  assert.match(markup, /value="b" selected/);
  assert.match(markup, /<svg/);
  assert.match(markup, /py-3 pl-4 pr-10 text-sm/);
});
