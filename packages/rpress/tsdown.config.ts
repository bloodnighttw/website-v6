import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    dynamic: "src/core/dynamic.tsx",
    helper: "src/helper/index.ts",
    // prevent hydration errors when import this module
    error: "src/helper/error.tsx",
    vite: "src/vite/index.ts",
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
  external: ["lightningcss", "vite", "@vitejs/plugin-rsc", "virtual:rpress:config", "virtual:rpress:routes"],
});
