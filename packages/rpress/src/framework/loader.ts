import * as ReactClient from "@vitejs/plugin-rsc/browser";
import type { RscPayload } from "./entry/shared";

const b = new Map<string, Promise<RscPayload>>();

function load(url: string) {

  if (!b.has(url)) {
    const payload = ReactClient.createFromFetch<RscPayload>(fetch(url));
    b.set(url, payload);
  }
  return b.get(url)!;
}

export default load;
