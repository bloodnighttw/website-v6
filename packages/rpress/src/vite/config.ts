import { type Plugin } from "vite";
import { type RPressConfig } from "@/vite/type";

const VIRTUAL_RPRESS_ROUTES = "virtual:rpress:routes";
const RESOLVED_VIRTUAL_RPRESS_ROUTES = "\0" + VIRTUAL_RPRESS_ROUTES;

export default function RPressConfig(_config: RPressConfig): Plugin[] {
  return [
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
            code: `export default [];`,
            moduleType: "js",
          };
        }
      },
    },
  ];
}
