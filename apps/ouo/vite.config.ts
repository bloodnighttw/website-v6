import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import rpress from "rpress/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx, { source } from "@rpress/mdx";
import { z } from "zod";
import { validTechStacks } from "./src/config/tech-stacks";
import { recmaInjectPreview, remarkExtractImage } from "@rpress/preview";
import rehypeShiki from "@shikijs/rehype";
import stylex from "@stylexjs/unplugin";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pjSchema = z.object({
  name: z.string(),
  description: z.string(),
  link: z.url().optional(),
  demo: z.url().optional(),
  stack: z.array(z.enum(validTechStacks)).optional(),
  thumbnail: z.string(),
});

const pj = source({
  name: "pj",
  include: "docs/project/**/*.mdx",
  schema: pjSchema,
});

const blogSchem = z.object({
  title: z.string(),
  date: z.string(),
  description: z.string(),
  categories: z.array(z.string()).optional(),
});

const blog = source({
  name: "blog",
  include: "docs/blog/**/*.mdx",
  schema: blogSchem,
  recmaPlugins: [recmaInjectPreview()],
  remarkPlugins: [remarkExtractImage()],
  rehypePlugins: [
    [
      rehypeShiki,
      {
        theme: "catppuccin-mocha",
        colorReplacements: {
          "#1e1e2e": "#18181B",
        },
      },
    ],
  ],
});

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    stylex.vite({
      useCSSLayers: true,
      aliases: {
        "@/*": [path.join(__dirname, "./src/*")],
      },
      unstable_moduleResolution: {
        type: "commonJS",
        rootDir: __dirname,
      },
    }),
    react(),
    rpress({
      routesDir: "src/routes/**",
      strictMode: true,
      prefetchStrategy: "hover",
    }),
    mdx([pj, blog]),
  ],
});

type PJ = z.infer<typeof pjSchema>;
type Blog = z.infer<typeof blogSchem>;

export type { PJ, Blog };
