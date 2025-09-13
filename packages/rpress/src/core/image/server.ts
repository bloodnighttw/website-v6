import base from "virtual:rpress:image-base";
import fs from "fs";

import loader from "./loader";
import { cache, use } from "react";
import type { ImageLoaderOptions } from "./handler";
import handleImageConversion from "./handler";
import ShouldThrowError from "../../utils/shouldThrowError";
import { url2Hash } from "./url2Hash";

class ImageConversionError extends ShouldThrowError {
  constructor(url: string, options: ErrorOptions) {
    super("Image conversion failed on " + url, options);
  }
}

function checkExist(path: string) {
  return fs.existsSync(path);
}

const cacheCheckExist = cache(checkExist);

async function image2file(options: ImageLoaderOptions) {
  console.log("Generating image for", options.url);
  const { url } = options;
  try {
    const hash = url2Hash(url);
    if (!url.startsWith("http")) return; // local file, return as is
    if (!import.meta.env.PROD) return; // only generate in production
    const path = base + hash + ".webp";
    // if folder not exist, create it
    const dir = base;
    if (!cacheCheckExist(path)) {
      await fs.promises.mkdir(dir);
    }

    const fetchFromurl = await fetch(url);
    if (!fetchFromurl.ok) {
      throw new Error("Failed to fetch image from URL: " + url);
    }
    const arrayBuffer = await fetchFromurl.arrayBuffer();

    const convertedBuffer = await handleImageConversion(arrayBuffer, options);
    await fs.promises.writeFile(path, convertedBuffer);
  } catch (e) {
    throw new ImageConversionError(url, { cause: e });
  }
}

const imageCache = new Map<string, Promise<void>>();

// to avoid multiple requests for the same image
// this is due to the nature of react's use() hook
// if we directly use image2file(options) in use(), it will be called multiple times
// so we cache the promise and return it if it already exists
function getOrSetCache(options: ImageLoaderOptions) {
  const hash = url2Hash(options.url, options);
  if (imageCache.has(hash)) return imageCache.get(hash)!;
  const promise = image2file(options);
  imageCache.set(hash, promise);
  return promise;
}

export default function handleGeneration(options: ImageLoaderOptions) {
  if (import.meta.env.PROD) {
    use(getOrSetCache(options));
  }
  return loader(options);
}
