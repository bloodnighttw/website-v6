import type { ImageLoaderOptions } from "@/libs/image/handler";
import handleImageConversion from "@/libs/image/handler";
import { generateSHA256 } from "@/libs/image/sha256";
import path from "path";
import { type Plugin } from "vite";
import fs from "fs";

const IMAGE_NEED_PROCESSING_VID = "virtual:rpress:image:mode";

declare global {
  var __RPRESS_IMAGES__: ImageLoaderOptions[] | undefined;
}

export function image(): Plugin[] {
  globalThis.__RPRESS_IMAGES__ = [];
  let NEED_GENERATE = true;
  let outDir = "";

  return [
    {
      name: "rpress:image",
      configResolved(config) {
        outDir = path.join(config.environments.client.build.outDir, "_rpress");
      },
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
          if (
            !globalThis.__RPRESS_IMAGES__ ||
            globalThis.__RPRESS_IMAGES__.length == 0
          ) {
            return;
          }

          // convert options to sha256=>options map
          // to avoid duplicate processing
          const uniqueImages = new Map<string, ImageLoaderOptions>();
          for (const imgOptions of globalThis.__RPRESS_IMAGES__) {
            const sha256 = generateSHA256(imgOptions);
            if (!uniqueImages.has(sha256)) {
              uniqueImages.set(sha256, imgOptions);
            }
          }

          for (const [sha256, imgOption] of uniqueImages.entries()) {
            const imageRequest = await fetch(imgOption.url);
            if (!imageRequest.ok) {
              throw new Error(`Failed to fetch image: ${imgOption.url}`);
            }
            const buffer = await imageRequest.arrayBuffer();

            const processedBuffer = await handleImageConversion(
              buffer,
              imgOption,
            );

            const outputFilePath = path.join(outDir, `${sha256}.webp`);

            await fs.promises.mkdir(path.dirname(outputFilePath), {
              recursive: true,
            });
            await fs.promises.writeFile(
              outputFilePath,
              Buffer.from(processedBuffer),
            );
          }
        },
      },
    },
  ];
}
