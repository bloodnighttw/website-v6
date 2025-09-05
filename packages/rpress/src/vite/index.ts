import path from "path";
import fs from "node:fs";
import { type Plugin } from "vite";
import rsc from "@vitejs/plugin-rsc";
import { rscSsgPlugin as ssg } from "./ssg";
import type { RPressConfig } from "../core/defineConfig";

const PKG_NAME = "rpress";
const VIRTUAL_RPRESS_CONFIG = "virtual:rpress:config";
const VIRTUAL_RPRESS_ROUTES = "virtual:rpress:routes";
const RESOLVED_VIRTUAL_RPRESS_CONFIG = "\0" + VIRTUAL_RPRESS_CONFIG;
const RESOLVED_VIRTUAL_RPRESS_ROUTES = "\0" + VIRTUAL_RPRESS_ROUTES;

export default function rpress(): Plugin[] {
  let config: RPressConfig | null = null;
  let configFilePath: string | null = null;

  return [
    {
      name: "rpress:resolve-config",
      async configResolved(resolvedConfig) {
        const root = resolvedConfig.root || process.cwd();
        const mode =
          resolvedConfig.mode || process.env.NODE_ENV || "development";

        const candidates = [
          "rpress.config.ts",
          "rpress.config.tsx",
          "rpress.config.js",
          "rpress.config.jsx",
          "rpress.config.mjs",
        ];

        let foundPath: string | null = null;
        for (const name of candidates) {
          const full = path.resolve(root, name);
          try {
            await fs.promises.access(full, fs.constants.R_OK);
          } catch {
            continue;
          }
          if (foundPath) {
            resolvedConfig.logger.warn(
              `[rpress] multiple rpress config files found, using ${foundPath} and ignoring ${full}`,
            );
            continue;
          }

          foundPath = full;
        }

        if (!foundPath) {
          resolvedConfig.logger.info(
            `[rpress] no rpress config found at ${root}`,
          );
          return;
        }

        // keep the path for the virtual module to re-export
        configFilePath = foundPath;

        try {
          const { loadConfigFromFile } = await import("vite");
          const loaded = await loadConfigFromFile(
            { command: "build", mode },
            foundPath,
          );

          if (loaded && loaded.config) {
            const userConfig = (loaded.config as any).default ?? loaded.config;
            config = userConfig as RPressConfig;
          }
        } catch (err) {
          resolvedConfig.logger.warn(
            `[rpress] error reading ${path.basename(foundPath)}: ${(err as Error).message}`,
          );
        }
      },
    },

    // Virtual module that exposes loaded rpress config as an importable module.
    {
      name: "rpress:virtual-config",
      resolveId(id) {
        if (id === VIRTUAL_RPRESS_CONFIG) {
          return RESOLVED_VIRTUAL_RPRESS_CONFIG;
        }
      },
      async load(id) {
        if (id !== RESOLVED_VIRTUAL_RPRESS_CONFIG) return null;

        if (configFilePath) {
          // Resolve the config file through Vite so it can be transformed/handled by other plugins
          const resolved = await this.resolve(configFilePath, undefined, {
            skipSelf: true,
          });
          const importId =
            resolved && (resolved as any).id
              ? (resolved as any).id
              : configFilePath;

          // Import the module namespace and re-export its default (or the namespace as fallback)
          return `import * as __rpress_cfg from ${JSON.stringify(importId)};\nexport default (__rpress_cfg && __rpress_cfg.default) ? __rpress_cfg.default : __rpress_cfg;\nexport const rpressConfigFile = ${JSON.stringify(importId)};\n`;
        }

        throw new Error("RPress config not found");
      },
    },

    {
      name: "rpress:inject-route",
      resolveId(id) {
        if (id === VIRTUAL_RPRESS_ROUTES) {
          return RESOLVED_VIRTUAL_RPRESS_ROUTES;
        }
      },
      async load(id) {
        if (id !== RESOLVED_VIRTUAL_RPRESS_ROUTES) return null;

        return `export default Object.values( import.meta.glob('/${config?.routesDir}', { eager: true })).filter(module => !!module?.route);`;
      },
    },

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
      name: "rsc-ssg",
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
