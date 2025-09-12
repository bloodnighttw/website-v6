import { type Plugin } from "vite";

export function image(): Plugin[] {
  let imageOutDir: string;
  return [
    {
      name: "rpress:image",
      configResolved(config) {
        config.build.rollupOptions.external = [
          // ...((config.build.rollupOptions.external as string[]) || []),
          "./node_modules/rpress/dist/image/loader",
          "./node_modules/rpress/dist/image/server",
        ];
      },
      resolveId(id) {
        if (id === "virtual:rpress:image") {
          if (this.environment.name === "client") {
            return this.resolve("./node_modules/rpress/dist/image/loader");
          } else {
            return this.resolve("./node_modules/rpress/dist/image/server");
          }
        }
      },
    },
    {
      name: "rpress:image-base",
      configResolved(config) {
        imageOutDir = config.environments.client.build.outDir + "/images/";
      },
      resolveId(id) {
        if (id === "virtual:rpress:image-base") {
          return "\0" + id;
        }
      },
      load(id) {
        if (id === "\0virtual:rpress:image-base") {
          return `export default "${imageOutDir}"`;
        }
      },
    },
  ];
}
