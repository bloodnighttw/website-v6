import * as ReactClient from "@vitejs/plugin-rsc/browser";
import type { RscPayload } from "../utils/path/constant";
import normalize, { normalized2rsc } from "../utils/path/normalize";

const b = new Map<string, Promise<RscPayload>>();

function load(url: string) {
  url = normalized2rsc(normalize(url));

  if (!b.has(url)) {
    const payload = ReactClient.createFromFetch<RscPayload>(fetch(url));
    b.set(url, payload);
  }
  return b.get(url)!;
}

if (import.meta.hot) {
  import.meta.hot.on("rsc:update", () => {
    b.clear();
  });
}

export default load;
