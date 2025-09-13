import sharp from "sharp";
import base from "virtual:rpress:image-base";
import fs from "fs";

import loader, { url2Hash } from "./loader";
import { use } from "react";
import { type ImageLoaderOptions } from "./loader";

async function image2file(url: string, hash: string) {
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
  const buffer = Buffer.from(arrayBuffer);

  await sharp(buffer).webp({ quality: 80 }).toFile(path);
  return path;
}

export default function handleGeneration(options: ImageLoaderOptions) {
  const { url } = options;
  const hash = url2Hash(url);
  if (import.meta.env.PROD) {
    use(image2file(url, hash));
  }
  return loader({ url });
}
