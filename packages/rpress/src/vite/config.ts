import { type Plugin } from "vite";
import defineConfig, { type RPressConfig } from "../core/defineConfig";

const VIRTUAL_RPRESS_CONFIG = "virtual:rpress:config";
const VIRTUAL_RPRESS_ROUTES = "virtual:rpress:routes";
const RESOLVED_VIRTUAL_RPRESS_CONFIG = "\0" + VIRTUAL_RPRESS_CONFIG;
const RESOLVED_VIRTUAL_RPRESS_ROUTES = "\0" + VIRTUAL_RPRESS_ROUTES;

export default function RPressConfig(
  directConfig?: Partial<RPressConfig>,
): Plugin[] {
  if (!directConfig) {
    throw new Error(
      "[rpress] Config must be passed directly to the rpress plugin. Config files are no longer supported.",
    );
  }

  const config = defineConfig(directConfig);

  return [
    {
      name: "rpress:config-json",
      resolveId(id) {
        if (id === VIRTUAL_RPRESS_CONFIG + "/json") {
          return RESOLVED_VIRTUAL_RPRESS_CONFIG + "/json";
        }
      },
      load(id) {
        if (id === RESOLVED_VIRTUAL_RPRESS_CONFIG + "/json") {
          return `export default ${JSON.stringify(config)};`;
        }
      },
    },

    {
      name: "rpress:config",
      resolveId(id) {
        if (id === VIRTUAL_RPRESS_CONFIG) {
          return RESOLVED_VIRTUAL_RPRESS_CONFIG;
        }
      },
      load(id) {
        if (id === RESOLVED_VIRTUAL_RPRESS_CONFIG) {
          return `export default ${JSON.stringify(config)};`;
        }
      },
    },

    {
      name: "rpress:inject-route",
      resolveId(id) {
        if (id === VIRTUAL_RPRESS_ROUTES) {
          return RESOLVED_VIRTUAL_RPRESS_ROUTES;
        }
      },
      load(id) {
        if (id === RESOLVED_VIRTUAL_RPRESS_ROUTES) {
          return `export default Object.values( import.meta.glob('/${config.routesDir}', { eager: true })).filter(module => !!module?.route);`;
        }
      },
    },
  ];
}
