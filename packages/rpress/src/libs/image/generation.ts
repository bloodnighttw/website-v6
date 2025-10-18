// a module to handle image url generation with different modes

import MODE from "virtual:rpress:image:mode";
import type { ImageLoaderOptions } from "./handler";
import IS_CLIENT from "virtual:rpress:client-env";
import { generateSHA256 } from "./sha256";

export default function generateImageURL(options: ImageLoaderOptions) {
  if (MODE === "dynamic") {
    return (
      "/_rpress?url=" +
      encodeURIComponent(options.url) +
      (options.quality ? `&quality=${options.quality}` : "") +
      (options.width ? `&width=${options.width} ` : "") +
      (options.height ? `&height=${options.height}` : "")
    );
  }

  if (MODE === "generation") {
    if (!IS_CLIENT) {
      globalThis.__RPRESS_IMAGES__!.push(options);
    }

    const sha256 = generateSHA256(options);
    return `/_rpress/${sha256}.webp`;
  }
}
