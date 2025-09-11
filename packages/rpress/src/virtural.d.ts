declare module "virtual:rpress:config" {
  const config: import("./core/defineConfig").RPressConfig;
  export default config;
}

declare module "virtual:rpress:routes" {
  const routes: import("./core/route/route").RouteModule[];
  export default routes;
}

declare module "virtual:rpress:config/json" {
  const config: import("./core/defineConfig").RPressConfig;
  export default config;
}

declare module "virtual:rpress:rsc-loader" {
  import load from "./core/rsc-loader";
  export default load;
}

declare module "virtual:rpress:image" {
  export default (url: string) => string;
}

declare module "virtual:rpress:image-base" {
  const string: string;
  export default string;
}
