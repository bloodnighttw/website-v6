import * as ReactServer from "@vitejs/plugin-rsc/rsc";
import { type RscPayload } from "../config";
import { isRscRequest, normalizeByRequest } from "../utils/path";
import { type RouteModule } from "../core/route";
import { generateStaticPaths } from "../utils/genPath2Modules";

const allRouteModules = Object.values(
  import.meta.glob("/src/routes/**", {
    eager: true,
  }),
).filter(
  (module): module is RouteModule => !!(module as Partial<RouteModule>)?.route,
);

export const path2Modules = await generateStaticPaths(allRouteModules);

function generateRSCStream({ request }: { request: Request }) {
  const normalizeUrl = normalizeByRequest(request);

  if (!path2Modules[normalizeUrl]) {
    return undefined;
  }

  const module = path2Modules[normalizeUrl];

  const url = new URL(normalizeUrl, new URL(request.url).origin);

  const Component = module.default;
  const matcher = module.route.matcher;

  const params = matcher.exec(url.pathname);
  // when params are not match, matcher.exec will return null;
  if(!params) return undefined;
  const rscPayload: RscPayload = {
    root: <Component params={params.params} />,
  };
  const rscStream = ReactServer.renderToReadableStream<RscPayload>(rscPayload);
  return rscStream;
}

export default async function handler(request: Request): Promise<Response> {
  const rscStream = generateRSCStream({ request });

  if (!rscStream) {
    return new Response("Not Found", { status: 404 });
  }

  if (isRscRequest(request)) {
    return new Response(rscStream, {
      headers: {
        "content-type": "text/x-component;charset=utf-8",
        vary: "accept",
      },
    });
  }

  // to prevent circular import
  const ssr = await import.meta.viteRsc.loadModule<typeof import("./ssr")>(
    "ssr",
    "index",
  );
  const htmlStream = await ssr.renderHtml(rscStream);

  return new Response(htmlStream, {
    headers: {
      "content-type": "text/html;charset=utf-8",
      vary: "accept",
    },
  });
}

// return both rsc and html streams at once for ssg
export async function handleSsg(request: Request): Promise<{
  html: ReadableStream<Uint8Array>;
  rsc: ReadableStream<Uint8Array>;
}> {
  const rscStream = generateRSCStream({ request });

  if (!rscStream) {
    throw new Error("Static path not found",);
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
