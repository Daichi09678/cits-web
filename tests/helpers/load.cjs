const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const path = require("node:path");

function load(relative, overrides = {}, globals = {}) {
  const filename = path.resolve(__dirname, "../../src", relative);
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(
    code,
    {
      exports,
      require: (id) => {
        if (id in overrides) return overrides[id];
        if (id.startsWith("node:")) return require(id);
        throw new Error(`Unexpected import: ${id}`);
      },
      console,
      URL,
      ...globals,
    },
    { filename }
  );
  return exports;
}

module.exports = { load };
