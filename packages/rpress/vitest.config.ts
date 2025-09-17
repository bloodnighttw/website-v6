import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
  resolve: {
    alias: {
      "virtual:rpress:image": new URL(
        "./test/mocks/virtual-image.ts",
        import.meta.url,
      ).pathname,
      "virtual:rpress:image-base": new URL(
        "./test/mocks/virtual-image-base.ts",
        import.meta.url,
      ).pathname,
    },
  },
});
