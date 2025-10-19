import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfig from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfig()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    env: {
      NODE_ENV: "test",
    },
    // Silence specific jsdom warnings
    onConsoleLog(log) {
      if (log.includes("Not implemented: navigation")) {
        return false; // Don't log navigation warnings
      }
    },
  },
  resolve: {
    alias: {
      "virtual:rpress:image:mode": new URL(
        "./test/mocks/virtual-image-mode.ts",
        import.meta.url,
      ).pathname,
      "virtual:rpress:config": new URL(
        "./test/mocks/virtual-config.ts",
        import.meta.url,
      ).pathname,
      "virtual:rpress:rsc-loader": new URL(
        "./test/mocks/virtual-rsc-loader.ts",
        import.meta.url,
      ).pathname,
      "virtual:rpress:client-env": new URL(
        "./test/mocks/virtual-client-env.ts",
        import.meta.url,
      ).pathname,
    },
  },
});
