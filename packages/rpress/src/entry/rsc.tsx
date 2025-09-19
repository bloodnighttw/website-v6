import normalize from "@/libs/utils/path/normalize";

import allRouteModules from "virtual:rpress:routes";

export { normalize, allRouteModules };

export default async function handler(_request: Request): Promise<Response> {
  // we just ignore it.
  return new Response(null, { status: 204 });
}

// return both rsc and html streams at once for ssg
export async function handleSsg(): Promise<{
  html: ReadableStream<Uint8Array>;
  rsc: ReadableStream<Uint8Array>;
}> {
  return { html: new ReadableStream(), rsc: new ReadableStream() };
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
