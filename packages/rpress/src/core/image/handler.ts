import sharp from "sharp";

export interface ImageLoaderOptions {
  url: string;
  quality?: number; // 1-100
  width?: number; // in pixels
  height?: number; // in pixels
}

export default async function handleImageConversion(
  buffer: ArrayBuffer,
  options: ImageLoaderOptions,
) {
  let sharpInstance = sharp(Buffer.from(buffer));

  // Handle size parameter (width x height or just width)
  const height = options.height;
  const width = options.width;

  if (width || height) {
    const resizeOptions: sharp.ResizeOptions = {};
    if (width && !isNaN(Number(width))) {
      resizeOptions.width = Number(width);
    }
    if (height && !isNaN(Number(height))) {
      resizeOptions.height = Number(height);
    }
    sharpInstance = sharpInstance.resize(resizeOptions);
  }

  // Handle quality parameter
  const quality = options.quality;
  const qualityNum = quality ?? 100;

  if (qualityNum && !isNaN(qualityNum) && qualityNum > 0 && qualityNum <= 100) {
    // Convert to WebP with specified quality
    sharpInstance = sharpInstance.webp({ quality: qualityNum });
  } else {
    // Default WebP conversion
    sharpInstance = sharpInstance.webp({ quality: 100 });
  }

  const processedBuffer = await sharpInstance.toBuffer();
  return processedBuffer;
}
