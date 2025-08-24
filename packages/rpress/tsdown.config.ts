import { defineConfig } from "tsdown";

export default defineConfig({
    entry: {
        "index": "src/index.ts",
        "vite": "src/framework/vite/index.ts",
        "entry/browser": "src/framework/entry/browser.tsx",
        "entry/rsc": "src/framework/entry/rsc.tsx",
        "entry/ssr": "src/framework/entry/ssr.tsx"
    },
    format: ["esm"],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: true,
    target: "esnext",
    external: ["lightningcss", "vite"],
    watch: ["src/**/*"],
});