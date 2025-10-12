import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import rpress from "rpress/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import mdx, { source } from "@rpress/mdx";

const pj = source({
  name: "pj",
  include: "docs/project/**/*.mdx",
  remarkPlugins: [remarkMdxFrontmatter],
});

export default defineConfig({
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    react(),
    rpress({
      routesDir: "src/routes/**",
      strictMode: true,
      prefetchStrategy: "hover",
    }),
    mdx([pj]),
  ],
});
