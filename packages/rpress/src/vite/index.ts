import { type Plugin } from "vite";
import rsc from "@vitejs/plugin-rsc";
import { rscSsgPlugin as ssg } from "./ssg";
import rscLoader from "./rsc-loader";
import rscConfig from "./config";
import { image } from "./image";
import { type RPressConfig } from "../core/defineConfig";

const PKG_NAME = "rpress";

export default function rpress(config: Partial<RPressConfig>): Plugin[] {
  return [
    ...image(),
    ...rscConfig(config),
    rscLoader(),
    ...rsc({
      entries: {
        client: "./node_modules/rpress/dist/entry/browser.js",
        rsc: "./node_modules/rpress/dist/entry/rsc.js",
        ssr: "./node_modules/rpress/dist/entry/ssr.js",
      },
      serverHandler: process.env.isPreview ? false : undefined,
      useBuildAppHook: true,
    }),
    ...ssg(),
    {
      name: "rpress:resolve-deps",
      configEnvironment(_name, environmentConfig, _env) {
        // see @vitejs/vite-plugin-react issue #789
        // make @vitejs/plugin-rsc usable as a transitive dependency
        // by rewriting `optimizeDeps.include`. e.g.
        // include: ["@vitejs/plugin-rsc/vendor/xxx", "@vitejs/plugin-rsc > yyy"]
        // ⇓
        // include: ["waku > @vitejs/plugin-rsc/vendor/xxx", "waku > @vitejs/plugin-rsc > yyy"]
        if (environmentConfig.optimizeDeps?.include) {
          environmentConfig.optimizeDeps.include =
            environmentConfig.optimizeDeps.include.map((name) => {
              if (name.startsWith("@vitejs/plugin-rsc")) {
                name = `${PKG_NAME} > ${name}`;
              }
              return name;
            });
        }
      },
    },
  ];
}

export type { RPressConfig };
