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

async function handleImageRequest(request: Request): Promise<Response | null> {
  const url = new URL(request.url);

  if (!url.pathname.startsWith("/_rpress")) {
    return null;
  }

  const imageUrl = url.searchParams.get("url");
  if (!imageUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return new Response("Failed to fetch image", { status: 404 });
    }

    const buffer = await response.arrayBuffer();
    const options = {
      url: imageUrl,
      width: url.searchParams.get("width")
        ? parseInt(url.searchParams.get("width") as string)
        : undefined,
      height: url.searchParams.get("height")
        ? parseInt(url.searchParams.get("height") as string)
        : undefined,
      quality: url.searchParams.get("quality")
        ? parseInt(url.searchParams.get("quality") as string)
        : undefined,
    };

    const processedBuffer = await handleImageConversion(buffer, options);

    return new Response(processedBuffer as BodyInit, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Image processing error:", error);
    return new Response("Image processing failed", { status: 500 });
  }
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
      configureServer(server) {
        globalThis.__RPRESS_IMAGES__ = undefined;
        NEED_GENERATE = false;

        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith("/_rpress")) {
            return next();
          }

          try {
            const request = new Request(
              new URL(req.url, `http://${req.headers.host}`).href,
            );
            const imageResponse = await handleImageRequest(request);

            if (imageResponse) {
              res.statusCode = imageResponse.status;
              imageResponse.headers.forEach((value, key) => {
                res.setHeader(key, value);
              });
              const buffer = await imageResponse.arrayBuffer();
              res.end(Buffer.from(buffer));
              return;
            }
          } catch (error) {
            console.error("Image middleware error:", error);
          }

          next();
        });
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
