import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    route: "src/exports/route.ts",
    helper: "src/exports/helper.ts",
    navigate: "src/exports/navigate.ts",
    link: "src/exports/link.ts",
    nossr: "src/exports/nossr.ts",
    vite: "src/exports/vite.ts",

    // for virtual module in vite-rsc plugin
    "rsc-loader": "src/libs/route/rsc-loader.tsx",

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
  external: [
    "lightningcss",
    "vite",
    "@vitejs/plugin-rsc",
    "virtual:rpress:config",
    "virtual:rpress:routes",
    "virtual:rpress:rsc-loader",
    "virtual:rpress:image",
    "virtual:rpress:image-base",
    "virtual:rpress:client-env",
  ],
});
