import base from "virtual:rpress:image-base";
import fs from "fs";

import loader, { url2Hash } from "./loader";
import { use } from "react";
import type { ImageLoaderOptions } from "./handler";
import handleImageConversion from "./handler";
import ShouldThrowError from "../../utils/shouldThrowError";

class ImageConversionError extends ShouldThrowError {
  constructor(url: string, options: ErrorOptions) {
    super("Image conversion failed on " + url, options);
  }
}

async function image2file(options: ImageLoaderOptions) {
  const { url } = options;
  try {
    const hash = url2Hash(url);
    if (!url.startsWith("http")) return url; // local file, return as is
    if (!import.meta.env.PROD) return url; // only generate in production
    const path = base + hash + ".webp";
    // if folder not exist, create it
    const dir = base;
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir);
    }

    console.log("Generating image:", url, "->", path);

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

export default function handleGeneration(options: ImageLoaderOptions) {
  if (import.meta.env.PROD) {
    use(image2file(options));
  }
  return loader(options);
}
