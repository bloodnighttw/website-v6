import path from "path";
import fs from "node:fs";
import { loadConfigFromFile, type Plugin } from "vite";
import { type RPressConfig } from "../core/defineConfig";

const VIRTUAL_RPRESS_CONFIG = "virtual:rpress:config";
const VIRTUAL_RPRESS_ROUTES = "virtual:rpress:routes";
const RESOLVED_VIRTUAL_RPRESS_CONFIG = "\0" + VIRTUAL_RPRESS_CONFIG;
const RESOLVED_VIRTUAL_RPRESS_ROUTES = "\0" + VIRTUAL_RPRESS_ROUTES;

export default function RPressConfig(): Plugin[] {
  let config: RPressConfig | null = null;
  let configFilePath: string | null = null;

  return [
    {
      name: "rpress:config-json",
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
            // file does not exist or not readable
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
          const loaded = await loadConfigFromFile(
            { command: "build", mode },
            foundPath,
          );

          if (loaded && loaded.config) {
            const exported = loaded.config as {
              default: Partial<RPressConfig>;
            };
            const userConfig = Object.prototype.hasOwnProperty.call(
              exported,
              "default",
            )
              ? exported.default
              : exported;

            config = userConfig as RPressConfig;
          }
        } catch (err) {
          resolvedConfig.logger.warn(
            `[rpress] error reading ${path.basename(foundPath)}: ${(err as Error).message}`,
          );
        }
      },
      resolveId(id) {
        if (id === VIRTUAL_RPRESS_CONFIG + "/json") {
          return RESOLVED_VIRTUAL_RPRESS_CONFIG + "/json";
        }
      },
      load(id) {
        if (id === RESOLVED_VIRTUAL_RPRESS_CONFIG + "/json") {
          if (config) {
            return `export default ${JSON.stringify(config)};`;
          } else {
            throw new Error("RPress config not found");
          }
        }
      },
    },

    {
      name: "rpress:config",
      async resolveId(id) {
        if (id !== VIRTUAL_RPRESS_CONFIG) return;

        // prefer resolving directly to the discovered config file if available
        const target = configFilePath ?? "/rpress.config";
        const resolved = await this.resolve(target, undefined, {
          skipSelf: true,
        });
        return resolved?.id ?? null;
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
  ];
}
