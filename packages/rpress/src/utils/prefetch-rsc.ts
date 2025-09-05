import type { RscPayload } from "./path/constant";
import * as ReactClient from "@vitejs/plugin-rsc/browser";

class FetchRSC {
  constructor() {
    console.log("FetchRSC initialized");
  }

  private cache = new Map<string, Promise<RscPayload>>();

  public load(string: string | URL) {
    if (this.cache.has(string.toString())) {
      const promise = this.cache.get(string.toString())!;
      return promise;
    }
    const promise = ReactClient.createFromFetch<RscPayload>(fetch(string));
    this.cache.set(string.toString(), promise);
    return promise;
  }

  public preload(string: string | URL) {
    this.load(string);
  }
}

export default new FetchRSC();
