import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import rpress from "rpress/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import mdx, { source } from "@rpress/mdx";
import { z } from "zod";

const pjSchema = z.object({
  name: z.string(),
  description: z.string(),
  link: z.url().optional(),
  demo: z.url().optional(),
});

const pj = source({
  name: "pj",
  include: "docs/project/**/*.mdx",
  schema: pjSchema,
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

type PJ = z.infer<typeof pjSchema>;

export type { PJ };
