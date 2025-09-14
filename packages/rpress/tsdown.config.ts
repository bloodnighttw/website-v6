import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    route: "src/core/route/index.ts",
    dynamic: "src/core/dynamic.tsx",
    helper: "src/helper/index.ts",
    link: "src/core/link.tsx",
    nossr: "src/core/nossr.tsx",
    "rsc-loader": "src/core/rsc-loader.tsx",
    // prevent hydration errors when import this module
    error: "src/helper/error.tsx",
    vite: "src/vite/index.ts",
    "entry/browser": "src/entry/browser.tsx",
    "entry/rsc": "src/entry/rsc.tsx",
    "entry/ssr": "src/entry/ssr.tsx",
    "image/server": "src/core/image/server.ts",
    "image/loader": "src/core/image/client.ts",
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
