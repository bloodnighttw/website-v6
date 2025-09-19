import react from "@vitejs/plugin-react";
import rpress from "rpress/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    rpress({
      routesDir: "src/routes/**",
      strictMode: true,
      prefetchStrategy: "hover",
    }),
    react(),
  ],
  // not work
  // environments: {
  //   ssr: {
  //     build: {
  //       rollupOptions: {
  //         platform: "neutral", // 👈👈
  //         experimental: {
  //           strictExecutionOrder: true, // likely advancedChunks/strictExecutionOrder is the trigger
  //         },
  //       },
  //     },
  //   },
  // },
  // builder: {
  //   async buildApp(builder) {
  //     await builder.build(builder.environments.ssr);
  //   },
  // },
});
