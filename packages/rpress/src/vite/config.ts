import { type Plugin } from "vite";
import { type RPressConfig } from "@/vite/type";

const VIRTUAL_RPRESS_CONFIG = "virtual:rpress:config";
const VIRTUAL_RPRESS_ROUTES = "virtual:rpress:routes";
const RESOLVED_VIRTUAL_RPRESS_CONFIG = "\0" + VIRTUAL_RPRESS_CONFIG;
const RESOLVED_VIRTUAL_RPRESS_ROUTES = "\0" + VIRTUAL_RPRESS_ROUTES;

export default function RPressConfig(config: RPressConfig): Plugin[] {
  return [
    {
      name: "rpress:config",
      resolveId(id) {
        if (id === VIRTUAL_RPRESS_CONFIG) {
          return RESOLVED_VIRTUAL_RPRESS_CONFIG;
        }
      },
      load(id) {
        if (id === RESOLVED_VIRTUAL_RPRESS_CONFIG) {
          return {
            code: `export default ${JSON.stringify(config)};`,
            moduleType: "js",
          };
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
          return {
            code: `export default Object.values( import.meta.glob('/${config.routesDir}', { eager: true })).filter(module => !!module?.route);`,
            moduleType: "js",
          };
        }
      },
    },
  ];
}
