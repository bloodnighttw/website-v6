import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import rpress from "rpress/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import mdx from "@rpress/mdx";

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }),
    tailwindcss(),
    tsconfigPaths(),
    react(),
    rpress({
      routesDir: "src/routes/**",
      strictMode: true,
      prefetchStrategy: "hover",
    }),
  ],
});
