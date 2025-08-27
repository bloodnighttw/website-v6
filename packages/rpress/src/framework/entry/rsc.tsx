import * as ReactServer from "@vitejs/plugin-rsc/rsc";
import { type RscPayload } from "./shared";
import { isRscRequest } from "./shared/path";
import { type RouteModule } from "../routeV2";

export const allRouteModules = Object.values(
  import.meta.glob("/src/routes/**", {
    eager: true,
  }),
)[0] as unknown as RouteModule;

function generateRSCStream({ request }: { request: Request }) {
  const C = allRouteModules.default;

  const rscPayload: RscPayload = {
    root: <C />
  }

  return ReactServer.renderToReadableStream<RscPayload>(rscPayload);
}

export default async function handler(request: Request): Promise<Response> {
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
