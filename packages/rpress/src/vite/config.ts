import { type Plugin } from "vite";
import { type RPressConfig } from "@/vite/type";

const VIRTUAL_RPRESS_CONFIG = "virtual:rpress:config";
const VIRTUAL_RPRESS_ROUTES = "virtual:rpress:routes";
const VIRTUAL_RPRESS_ENV = "virtual:rpress:client-env";
const RESOLVED_VIRTUAL_RPRESS_CONFIG = "\0" + VIRTUAL_RPRESS_CONFIG;
const RESOLVED_VIRTUAL_RPRESS_ROUTES = "\0" + VIRTUAL_RPRESS_ROUTES;
const RESOLVED_VIRTUAL_RPRESS_ENV = "\0" + VIRTUAL_RPRESS_ENV;

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

    {
      name: "rpress:env",
      resolveId(id) {
        if (id === VIRTUAL_RPRESS_ENV) return RESOLVED_VIRTUAL_RPRESS_ENV;
      },
      load(id) {
        if (id === RESOLVED_VIRTUAL_RPRESS_ENV) {
          return `export default ${this.environment.name === "client"}`;
        }
      },
    },
  ];
}
