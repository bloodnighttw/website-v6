import type { ImageLoaderOptions } from "./handler";

export function url2Hash(url: string) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

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
  const hash = url2Hash(url);
  return "/images/" + hash + ".webp";
}
