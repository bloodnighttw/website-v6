import * as ReactServer from "@vitejs/plugin-rsc/rsc";
import { type RscPayload } from "./shared";
import { isRscRequest, normalizeByRequest } from "./shared/path";
import { type RouteModule } from "../routeV2";

export const allRouteModules = Object.values(
  import.meta.glob("/src/routes/**", {
    eager: true,
  }),
).filter((module): module is RouteModule => !!(module as any)?.config);

function generateRSCStream({ request }: { request: Request }) {
  const normalizeUrl = normalizeByRequest(request);
  const url = new URL(normalizeUrl, new URL(request.url).origin);

  for (const module of allRouteModules) {
    const Component = module.default;
    const matcher = module.config.matcher;

    if (matcher.test(url.pathname)) {
      const params = matcher.exec(url.pathname)!;
      const rscPayload: RscPayload = {
        root: <Component params={params.params} />,
      };
      const rscStream =
        ReactServer.renderToReadableStream<RscPayload>(rscPayload);
      return rscStream;
    }
  }

  throw new Error("not found");
}

export default async function handler(request: Request): Promise<Response> {
  const routeModules = import.meta.glob("/src/routes/**", {
    eager: true,
  }) as Record<string, Partial<RouteModule>>;

  console.log(Object.values(routeModules).map((it) => it.config));

  const rscStream = generateRSCStream({ request });

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
