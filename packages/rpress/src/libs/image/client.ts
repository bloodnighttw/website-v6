import type { ImageLoaderOptions } from "./handler";

export default function loader(options: ImageLoaderOptions) {
  console.warn("image convert cannot be done inside non-ssr component");
  return options.url;
}
