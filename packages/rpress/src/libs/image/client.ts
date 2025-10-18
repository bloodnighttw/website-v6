import IS_CLIENT from "virtual:rpress:client-env";
import type { ImageLoaderOptions } from "./handler";

export default function loader(options: ImageLoaderOptions) {
  console.log("client image loader called");
  // it will be treeshaken in client build.
  if (!IS_CLIENT) {
    globalThis.__RPRESS_IMAGES__?.push(options);
  }
  console.warn("image convert cannot be done inside non-ssr component");
  return options.url;
}
