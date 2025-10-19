import type { ImageLoaderOptions } from "./handler";
import crypto from "crypto";

export function generateSHA256(obj: ImageLoaderOptions) {
  // Recursively sort all object keys for deterministic serialization
  const sortedObj: ImageLoaderOptions = {
    url: obj.url,
    width: obj.width,
    height: obj.height,
    quality: obj.quality,
  };

  const jsonString = JSON.stringify(sortedObj);

  return crypto.createHash("sha256").update(jsonString, "utf8").digest("hex");
}
