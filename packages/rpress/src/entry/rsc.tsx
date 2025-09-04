import * as ReactServer from "@vitejs/plugin-rsc/rsc";
import { type RouteModule } from "../core/route";
import { isRSCRequest, matchParams } from "../utils/path/matcher";
import normalize from "../utils/path/normalize";
import type { RscPayload } from "../utils/path/constant";

import allRouteModules from "virtual:rpress:routes";

export { normalize, allRouteModules };

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
    return new Response("Internal Server Error", { status: 500 });
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
  const htmlStream = await ssr.renderHtml(rscStream1, {
    ssg: true,
  });

  return { html: htmlStream, rsc: rscStream2 };
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
