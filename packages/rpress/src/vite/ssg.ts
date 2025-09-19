import type { Plugin } from "vite";

export function rscSsgPlugin(): Plugin[] {
  return [
    {
      name: "rpress:rsc-ssg",
      config(_config, env) {
        if (env.isPreview) {
          return {
            appType: "mpa",
          };
        }
      },
      buildApp: {
        async handler() {
          await renderStatic();
        },
      },
    },
  ];
}

async function renderStatic() {
  console.log("we just ignore it");
}
