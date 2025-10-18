declare module "virtual:rpress:config" {
  const config: import("@/vite/type").RPressConfig;
  export default config;
}

declare module "virtual:rpress:routes" {
  const routes: import("@/libs/route/route").RouteModule[];
  export default routes;
}

declare module "virtual:rpress:rsc-loader" {
  const load: import("@/libs/route/rsc-loader").load;
  export default load;
}

declare module "virtual:rpress:image" {
  const loader: import("@/libs/image/server").loader;
  export default loader;
}

declare module "virtual:rpress:image-base" {
  const string: string;
  export default string;
}

declare module "virtual:rpress:client-env" {
  const isClient: boolean;
  export default isClient;
}
