import base from "virtual:rpress:image-base";
import fs from "fs";
import * as crypto from "crypto";

import { cache, use } from "react";
import type { ImageLoaderOptions } from "./handler";
import handleImageConversion from "./handler";
import ShouldThrowError from "@/libs/utils/shouldThrowError";
import path from "path";

class ImageConversionError extends ShouldThrowError {
  constructor(url: string, options: ErrorOptions) {
    super("Image conversion failed on " + url, options);
  }
}

function checkExist(path: string) {
  return fs.existsSync(path);
}

const cacheCheckExist = cache(checkExist);

function generateSHA256(obj: ImageLoaderOptions) {
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

async function image2file(options: ImageLoaderOptions) {
  console.log("Generating image for", options.url);
  const { url } = options;
  const hash = generateSHA256(options);
  try {
    if (!url.startsWith("http")) return url; // local file, return as is
    if (!import.meta.env.PROD)
      throw new ShouldThrowError(
        "file Generating should only bundle in production!",
      ); // only generate in production
    const filePath = path.join(base, hash + ".webp");
    // if folder not exist, create it
    const dir = base;
    if (!cacheCheckExist(filePath)) {
      await fs.promises.mkdir(dir);
    }

    const fetchFromurl = await fetch(url);
    if (!fetchFromurl.ok) {
      throw new Error("Failed to fetch image from URL: " + url);
    }
    const arrayBuffer = await fetchFromurl.arrayBuffer();
    const convertedBuffer = await handleImageConversion(arrayBuffer, options);
    await fs.promises.writeFile(filePath, convertedBuffer);

    return "/images/" + hash + ".webp";
  } catch (e) {
    throw new ImageConversionError(url, { cause: e });
  }
}

const imageCache = new Map<string, Promise<string>>();

// to avoid multiple requests for the same image
// this is due to the nature of react's use() hook
// if we directly use image2file(options) in use(), it will be called multiple times
// so we cache the promise and return it if it already exists
function getOrSetCache(options: ImageLoaderOptions) {
  const hash = generateSHA256(options);
  if (imageCache.has(hash)) return imageCache.get(hash)!;
  const promise = image2file(options);
  imageCache.set(hash, promise);
  return promise;
}

export default function handleGeneration(options: ImageLoaderOptions) {
  if (import.meta.env.DEV) {
    return (
      "_rpress?url=" +
      encodeURIComponent(options.url) +
      (options.quality ? `&quality=${options.quality}` : "") +
      (options.width ? `&width=${options.width} ` : "") +
      (options.height ? `&height=${options.height}` : "")
    );
  }
  return use(getOrSetCache(options));
}
