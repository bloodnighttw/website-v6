import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import inspect from "vite-plugin-inspect";
import rscSSG from "./src/framework/vite";

export default defineConfig({
  plugins: [mdx(), react(), rscSSG(), inspect()],
});
