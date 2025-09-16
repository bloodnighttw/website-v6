import * as ReactServer from "@vitejs/plugin-rsc/rsc";
import { type RouteModule } from "@/libs/route/route";
import { isRSCRequest, matchParams } from "@/libs/utils/path/matcher";
import normalize from "@/libs/utils/path/normalize";
import type { RscPayload } from "@/libs/utils/path/constant";

import allRouteModules from "virtual:rpress:routes";
import handleImageConversion from "@/libs/image/handler";

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

    // Process the image
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
  if (import.meta.env.DEV) {
    const imageResponse = await handleImageRequest(request);
    if (imageResponse) {
      return imageResponse;
    }
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
