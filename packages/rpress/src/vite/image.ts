import type { ImageLoaderOptions } from "@/libs/image/handler";
import { type Plugin } from "vite";

const IMAGE_NEED_PROCESSING_VID = "virtual:rpress:image:mode";

declare global {
  var __RPRESS_IMAGES__: ImageLoaderOptions[] | undefined;
}

export function image(): Plugin[] {
  globalThis.__RPRESS_IMAGES__ = [];
  let NEED_GENERATE = false;

  return [
    {
      name: "rpress:image",
      configureServer() {
        // we don't need it when server is running
        globalThis.__RPRESS_IMAGES__ = undefined;
        NEED_GENERATE = false;
      },
      resolveId(id) {
        if (id === IMAGE_NEED_PROCESSING_VID) {
          return "\0" + IMAGE_NEED_PROCESSING_VID;
        }
      },
      load(id) {
        if (id === "\0" + IMAGE_NEED_PROCESSING_VID) {
          return `export default ${NEED_GENERATE ? JSON.stringify("generation") : JSON.stringify("dynamic")};`;
        }
      },
      buildApp: {
        order: "post",
        async handler() {
          console.log("Images to process:!!!!!!!!");
          globalThis.__RPRESS_IMAGES__?.forEach((option) => {
            console.log(option);
          });
        },
      },
    },
  ];
}
