import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    dynamic: "src/core/dynamic.tsx",
    helper: "src/core/helper.tsx",
    vite: "src/vite/index.ts",
    error: "src/core/error.tsx",
    "entry/browser": "src/entry/browser.tsx",
    "entry/rsc": "src/entry/rsc.tsx",
    "entry/ssr": "src/entry/ssr.tsx",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  // in dev we don't need to clean
  clean: false,
  minify: true,
  target: "esnext",
  external: ["lightningcss", "vite", "@vitejs/plugin-rsc"],
});
