import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    route: "src/libs/route/index.ts",
    helper: "src/exports/helper.ts",
    navigate: "src/libs/route/navigate.tsx",
    link: "src/libs/route/link.tsx",
    nossr: "src/libs/nossr.tsx",
    // virtual module need this.
    "rsc-loader": "src/libs/route/rsc-loader.tsx",
    // prevent hydration errors when import this module
    error: "src/libs/utils/shouldThrowError.tsx",
    vite: "src/vite/index.ts",
    // for vite-rsc plugin
    "entry/browser": "src/entry/browser.tsx",
    // for vite-rsc plugin
    "entry/rsc": "src/entry/rsc.tsx",
    // for vite-rsc plugin
    "entry/ssr": "src/entry/ssr.tsx",
    // for virtual module
    "image/server": "src/libs/image/server.ts",
    "image/client": "src/libs/image/client.ts",
    image: "src/libs/image/index.tsx",
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
