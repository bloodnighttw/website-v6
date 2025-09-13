import type { ImageLoaderOptions } from "./handler";
import { url2Hash } from "./url2Hash";

export default function loader(options: ImageLoaderOptions) {
  const { url, quality, width, height } = options;
  if (!url.startsWith("http")) return url; // local file, return as is

  if (import.meta.env.DEV) {
    return (
      "_rpress?url=" +
      encodeURIComponent(url) +
      (quality ? `&quality=${quality}` : "") +
      (width ? `&width=${width} ` : "") +
      (height ? `&height=${height}` : "")
    );
  }
  const hash = url2Hash(url, options);
  return "/images/" + hash + ".webp";
}
