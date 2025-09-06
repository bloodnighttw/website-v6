import type { RscPayload } from "./path/constant";
import * as ReactClient from "@vitejs/plugin-rsc/browser";
import normalize, { normalized2rsc } from "./path/normalize";

// TODO: move this into context
class FetchRSC {
  constructor() {
    console.log("FetchRSC initialized");
  }

  private cache = new Map<string, Promise<RscPayload>>();

  public load(string: string | URL) {
    const rscURL = normalized2rsc(normalize(string.toString()));

    if (this.cache.has(rscURL)) {
      const promise = this.cache.get(rscURL)!;
      return promise;
    }
    const promise = ReactClient.createFromFetch<RscPayload>(fetch(rscURL));
    this.cache.set(rscURL, promise);
    return promise;
  }

  public preload(string: string | URL) {
    this.load(string);
  }
}

export default new FetchRSC();
