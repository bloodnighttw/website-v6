
declare module "virtual:rpress:config" { 
  import type { RPressConfig } from "./core/defineConfig";
  const config: RPressConfig;
  export default config;
}

declare module "virtual:rpress:routes" { 
  import type { RouteModule } from "./core/route";
  const routes: RouteModule[];
  export default routes;
}

