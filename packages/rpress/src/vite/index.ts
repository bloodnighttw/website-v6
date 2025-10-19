import { type Plugin } from "vite";
import rsc from "@vitejs/plugin-rsc";
import { rscSsgPlugin as ssg } from "./ssg";
import rscLoader from "./rsc-loader";
import rscConfig from "./config";
import { image } from "./image";
import { type RPressConfig } from "./type";

const PKG_NAME = "rpress";

const defaultConfig: RPressConfig = {
  strictMode: true,
  routesDir: "src/routes/**",
  prefetchStrategy: "hover",
  imgBaseURL: "_rpress",
};

export default function rpress(partConfig: Partial<RPressConfig>): Plugin[] {
  const config = { ...defaultConfig, ...partConfig };

  return [
    ...image(config.imgBaseURL),
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
