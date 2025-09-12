import * as ReactServer from "@vitejs/plugin-rsc/rsc";
import { type RouteModule } from "../core/route/route";
import { isRSCRequest, matchParams } from "../utils/path/matcher";
import normalize from "../utils/path/normalize";
import type { RscPayload } from "../utils/path/constant";
import sharp from "sharp";

import allRouteModules from "virtual:rpress:routes";

export { normalize, allRouteModules };

async function handleImageRequest(request: Request): Promise<Response | null> {
  const url = new URL(request.url);

  // Check if this is an image processing request
  if (!url.pathname.startsWith("/_rpress")) {
    return null;
  }

  const imageUrl = url.searchParams.get("url");
  if (!imageUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  try {
    // Fetch the original image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return new Response("Failed to fetch image", { status: 404 });
    }

    const buffer = await response.arrayBuffer();
    let sharpInstance = sharp(Buffer.from(buffer));

    // Handle size parameter (width x height or just width)
    const size = url.searchParams.get("size");
    if (size) {
      const [width, height] = size.split("x").map(Number);
      if (width && !isNaN(width)) {
        const options: sharp.ResizeOptions = { width };
        if (height && !isNaN(height)) {
          options.height = height;
        }
        sharpInstance = sharpInstance.resize(options);
      }
    }

    // Handle quality parameter
    const quality = url.searchParams.get("quality");
    const qualityNum = quality ? parseInt(quality, 10) : 80;

    if (
      qualityNum &&
      !isNaN(qualityNum) &&
      qualityNum > 0 &&
      qualityNum <= 100
    ) {
      // Convert to WebP with specified quality
      sharpInstance = sharpInstance.webp({ quality: qualityNum });
    } else {
      // Default WebP conversion
      sharpInstance = sharpInstance.webp({ quality: 80 });
    }

    const processedBuffer = await sharpInstance.toBuffer();

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

// export const allRouteModules = Object.values(
//   import.meta.glob("/src/routes/**", {
//     eager: true,
//   }),
// ).filter(
//   (module): module is RouteModule => !!(module as Partial<RouteModule>)?.route,
// );

async function generateRSCStream({ request }: { request: Request }) {
  const url = new URL(request.url);
  const normalizeUrl = normalize(url.pathname);

  let module: RouteModule | undefined = undefined;
  let params: Record<string, string> = {};
  for (const m of allRouteModules) {
    const matchResult = m.route.matcher.match(normalizeUrl);
    if (matchResult === false) continue;
    const gens = m.route.config.generator() as unknown as Promise<
      Record<string, string>[]
    >;
    const match = matchParams(matchResult, await gens);
    if (match === false) continue;
    module = m;
    params = match;
  }

  if (!module) {
    return undefined;
  }

  const Component = module.default;

  // when params are not match, matcher.exec will return null;
  if (!params) return undefined;
  const rscPayload: RscPayload = {
    root: <Component params={params} />,
  };
  const rscStream = ReactServer.renderToReadableStream<RscPayload>(rscPayload);
  return rscStream;
}

export default async function handler(request: Request): Promise<Response> {
  // Handle image processing requests first
  const imageResponse = await handleImageRequest(request);
  if (imageResponse) {
    return imageResponse;
  }

  const rscStream = await generateRSCStream({ request });

  if (!rscStream) {
    return new Response("Not Found", { status: 404 });
  }

  if (isRSCRequest(request)) {
    return new Response(rscStream, {
      headers: {
        "content-type": "text/x-component;charset=utf-8",
        vary: "accept",
      },
    });
  }

  try {
    // to prevent circular import
    const ssr = await import.meta.viteRsc.loadModule<typeof import("./ssr")>(
      "ssr",
      "index",
    );
    const htmlStream = await ssr.renderHtml(rscStream, {
      ssg: false,
    });

    return new Response(htmlStream, {
      headers: {
        "content-type": "text/html;charset=utf-8",
        vary: "accept",
      },
    });
  } catch (e) {
    // a tricky way to make sure e is Error,
    // this is because there will be some non-error thrown in the first time the page is loaded
    // when there has some reject in suspense boundary.

    return new Response("Internal Server Error, stacks: " + e, { status: 500 });
  }
}

// return both rsc and html streams at once for ssg
export async function handleSsg(request: Request): Promise<{
  html: ReadableStream<Uint8Array>;
  rsc: ReadableStream<Uint8Array>;
}> {
  const rscStream = await generateRSCStream({ request });

  if (!rscStream) {
    throw new Error("Static path not found");
  }

  const [rscStream1, rscStream2] = rscStream.tee();

  const ssr = await import.meta.viteRsc.loadModule<typeof import("./ssr")>(
    "ssr",
    "index",
  );
  try {
    const htmlStream = await ssr.renderHtml(rscStream1, {
      ssg: true,
    });
    return { html: htmlStream, rsc: rscStream2 };
  } catch (e) {
    throw new Error("SSG Render Error: " + e);
  }
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
