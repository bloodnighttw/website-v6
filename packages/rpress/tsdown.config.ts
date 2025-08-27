import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    vite: "src/framework/vite/index.ts",
    "entry/browser": "src/framework/entry/browser.tsx",
    "entry/rsc": "src/framework/entry/rsc.tsx",
    "entry/ssr": "src/framework/entry/ssr.tsx",
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
