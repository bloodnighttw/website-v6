import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    vite: "src/exports/vite.ts",
    // for vite-rsc plugin
    "entry/browser": "src/entry/browser.tsx",
    // for vite-rsc plugin
    "entry/rsc": "src/entry/rsc.tsx",
    // for vite-rsc plugin
    "entry/ssr": "src/entry/ssr.tsx",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  // in dev we don't need to clean
  clean: false,
  minify: true,
  target: "esnext",
  external: ["lightningcss", "vite"],
  platform: "node",
});
