const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const path = require("node:path");

function load(relative, overrides = {}, globals = {}, graph = { modules: new Map(), views: new Set() }) {
  const filename = path.resolve(__dirname, "../../src", relative);
  if (graph.modules.has(filename)) return graph.modules.get(filename);
  const pageModule = /components[\\/]pages[\\/]admin-(landing|contact|portfolio|products|services|clients)[\\/]/;
  const primitive = /components[\\/]ui[\\/](Button|Input|Select|FieldLabel|FormFeedback)\.tsx$/;
  const source = fs.readFileSync(filename, "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  graph.modules.set(filename, exports);
  vm.runInNewContext(
    code,
    {
      exports,
      require: (id) => {
        if (id === "react/jsx-runtime") {
          const runtime = overrides[id] ?? require(id);
          const render = (factory) => (type, props, key) => {
            const element = factory(type, props, key);
            if (!graph.views.has(type)) return element;
            const rendered = type(element.props);
            return key !== undefined && require("react").isValidElement(rendered)
              ? require("react").cloneElement(rendered, { key })
              : rendered;
          };
          return { ...runtime, jsx: render(runtime.jsx), jsxs: render(runtime.jsxs) };
        }
        if (id in overrides) return overrides[id];
        if (id.startsWith("node:")) return require(id);
        if (id === "@/components/ui/Button") {
          const button = load(
            "components/ui/Button.tsx",
            {
              "@/lib/cn": load("lib/cn.ts"),
            },
            globals,
            graph
          );
          graph.views.add(button.default);
          graph.views.add(button.BackOfficeButton);
          return button;
        }
        const candidate = id.startsWith("@/")
          ? path.resolve(__dirname, "../../src", id.slice(2))
          : id.startsWith(".") && (pageModule.test(filename) || primitive.test(filename))
            ? path.resolve(path.dirname(filename), id)
            : null;
        if (
          candidate &&
          (pageModule.test(candidate) ||
            primitive.test(candidate + ".tsx") ||
            id === "@/components/pages/admin/accentStyles" ||
            candidate.endsWith(path.join("lib", "cn")))
        ) {
          const target = [candidate + ".ts", candidate + ".tsx"].find(fs.existsSync);
          if (target)
            return load(path.relative(path.resolve(__dirname, "../../src"), target), overrides, globals, graph);
        }
        throw new Error(`Unexpected import: ${id}`);
      },
      console,
      URL,
      ...globals,
    },
    { filename }
  );
  // Inline only extracted, stateless views; stateful children keep their own hook lifecycle.
  if (primitive.test(filename)) {
    for (const value of Object.values(exports)) if (typeof value === "function") graph.views.add(value);
  } else if (
    pageModule.test(filename) &&
    filename.endsWith(".tsx") &&
    !/\buse[A-Z]\w*\s*(?:<[^>]*>)?\s*\(/.test(source) &&
    typeof exports.default === "function"
  )
    graph.views.add(exports.default);
  return exports;
}

module.exports = { load };
