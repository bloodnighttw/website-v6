import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    route: "src/core/route/index.ts",
    helper: "src/helper/index.ts",
    navigate: "src/core/route/navigate.tsx",
    link: "src/core/link.tsx",
    nossr: "src/core/nossr.tsx",
    // virtual module need this.
    "rsc-loader": "src/core/rsc-loader.tsx",
    // prevent hydration errors when import this module
    error: "src/helper/error.tsx",
    vite: "src/vite/index.ts",
    // for vite-rsc plugin
    "entry/browser": "src/entry/browser.tsx",
    // for vite-rsc plugin
    "entry/rsc": "src/entry/rsc.tsx",
    // for vite-rsc plugin
    "entry/ssr": "src/entry/ssr.tsx",
    // for virtual module
    "image/server": "src/core/image/server.ts",
    "image/client": "src/core/image/client.ts",
    image: "src/core/image/index.tsx",
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
