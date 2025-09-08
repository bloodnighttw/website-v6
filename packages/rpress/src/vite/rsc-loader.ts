import { type Plugin } from "vite";

export default function rscLoader(): Plugin {
  return {
    name: "rpress:rsc-loader",
    configResolved(config) {
      config.build.rollupOptions.external = [
        ...((config.build.rollupOptions.external as string[]) || []),
        "./node_modules/rpress/dist/rsc-loader",
      ];
    },
    resolveId(id) {
      if (id === "virtual:rpress:rsc-loader") {
        if (this.environment.name === "client") {
          return this.resolve("./node_modules/rpress/dist/rsc-loader");
        }
        return "\0" + id;
      }
    },
    async load(id) {
      if (id === "\0virtual:rpress:rsc-loader") {
        return `export default () => { throw new Error("rsc-loader cannot be used in non client environment")}`;
      }
    },
  };
}
