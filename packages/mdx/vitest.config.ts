import { defineConfig } from "vitest/config";
import tsconfig from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfig()],
});
