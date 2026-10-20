import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: { "react-hooks": reactHooks },
    rules: {
      // Payload API/DB bersifat dinamis sehingga `any` masih dipakai di beberapa
      // boundary; tetapi variabel/parameter yang tidak terpakai harus dibersihkan.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
      ],
      // Boundary API/DB memang menerima payload dinamis; `any` diizinkan sementara
      // tetapi ditandai sebagai peringatan agar bisa dibersihkan bertahap (Fase 2).
      "@typescript-eslint/no-explicit-any": "warn",
      eqeqeq: ["error", "smart"],
      "prefer-const": "error",
      // Pola sinkronisasi state setelah mount (localStorage/animation) masih dipakai
      // di beberapa komponen; ditandai sebagai peringatan untuk dibersihkan di Fase 2.
      "react-hooks/set-state-in-effect": "warn",
      // Icon dipilih dinamis lewat lookup map (getPillarIcon) sehingga analyzer
      // menganggapnya komponen baru tiap render — pola ini disengaja.
      "react-hooks/static-components": "warn",
    },
  },
  {
    // Test runner memakai CommonJS (node:test) sehingga require() memang disengaja.
    files: ["tests/**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  // Harus paling akhir: mematikan aturan format yang bentrok dengan Prettier.
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
