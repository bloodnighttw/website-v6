import type { ImageLoaderOptions } from "./handler";

export function url2Hash(url: string, options?: ImageLoaderOptions) {
  const hashInput = options
    ? `${url}-${options.quality || ""}-${options.width || ""}-${options.height || ""}`
    : url;
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}
