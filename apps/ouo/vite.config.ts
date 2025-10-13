import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import rpress from "rpress/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import mdx, { source } from "@rpress/mdx";
import { z } from "zod";

const pj = source({
  name: "pj",
  include: "docs/project/**/*.mdx",
  remarkPlugins: [remarkMdxFrontmatter],
  schema: z.object({
    name: z.string(),
    description: z.string(),
    link: z.url().optional(),
    demo: z.url().optional(),
  }),
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
