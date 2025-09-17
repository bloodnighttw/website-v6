import { expect, test, vi, beforeEach } from "vitest";

// Mock Sharp
vi.mock("sharp", () => {
  const mockResize = vi.fn().mockReturnThis();
  const mockWebp = vi.fn().mockReturnThis();
  const mockToBuffer = vi.fn();

  const mockSharpInstance = {
    resize: mockResize,
    webp: mockWebp,
    toBuffer: mockToBuffer,
  };

  return {
    default: vi.fn(() => mockSharpInstance),
  };
});

import handleImageConversion from "@/libs/image/handler";
import sharp from "sharp";

const mockSharp = sharp as any;
const mockSharpInstance = mockSharp();
const mockResize = mockSharpInstance.resize;
const mockWebp = mockSharpInstance.webp;
const mockToBuffer = mockSharpInstance.toBuffer;

beforeEach(() => {
  vi.clearAllMocks();
  mockToBuffer.mockResolvedValue(Buffer.from("processed-image-data"));
});

test("handleImageConversion processes image with basic options", async () => {
  const buffer = new ArrayBuffer(1024);
  const options = { url: "test.jpg" };

  const result = await handleImageConversion(buffer, options);

  expect(mockSharp).toHaveBeenCalledWith(Buffer.from(buffer));
  expect(mockWebp).toHaveBeenCalledWith({ quality: 100 });
  expect(mockToBuffer).toHaveBeenCalled();
  expect(result).toEqual(Buffer.from("processed-image-data"));
});

test("handleImageConversion resizes image with width only", async () => {
  const buffer = new ArrayBuffer(1024);
  const options = { url: "test.jpg", width: 800 };

  await handleImageConversion(buffer, options);

  expect(mockResize).toHaveBeenCalledWith({ width: 800 });
  expect(mockWebp).toHaveBeenCalledWith({ quality: 100 });
});

test("handleImageConversion resizes image with height only", async () => {
  const buffer = new ArrayBuffer(1024);
  const options = { url: "test.jpg", height: 600 };

  await handleImageConversion(buffer, options);

  expect(mockResize).toHaveBeenCalledWith({ height: 600 });
  expect(mockWebp).toHaveBeenCalledWith({ quality: 100 });
});

test("handleImageConversion resizes image with both width and height", async () => {
  const buffer = new ArrayBuffer(1024);
  const options = { url: "test.jpg", width: 800, height: 600 };

  await handleImageConversion(buffer, options);

  expect(mockResize).toHaveBeenCalledWith({ width: 800, height: 600 });
  expect(mockWebp).toHaveBeenCalledWith({ quality: 100 });
});

test("handleImageConversion applies custom quality", async () => {
  const buffer = new ArrayBuffer(1024);
  const options = { url: "test.jpg", quality: 80 };

  await handleImageConversion(buffer, options);

  expect(mockWebp).toHaveBeenCalledWith({ quality: 80 });
});

test("handleImageConversion handles quality edge cases", async () => {
  const buffer = new ArrayBuffer(1024);

  // Test quality = 0 (invalid, should use default)
  await handleImageConversion(buffer, { url: "test.jpg", quality: 0 });
  expect(mockWebp).toHaveBeenCalledWith({ quality: 100 });

  vi.clearAllMocks();

  // Test quality > 100 (invalid, should use default)
  await handleImageConversion(buffer, { url: "test.jpg", quality: 150 });
  expect(mockWebp).toHaveBeenCalledWith({ quality: 100 });

  vi.clearAllMocks();

  // Test quality = 1 (valid minimum)
  await handleImageConversion(buffer, { url: "test.jpg", quality: 1 });
  expect(mockWebp).toHaveBeenCalledWith({ quality: 1 });

  vi.clearAllMocks();

  // Test quality = 100 (valid maximum)
  await handleImageConversion(buffer, { url: "test.jpg", quality: 100 });
  expect(mockWebp).toHaveBeenCalledWith({ quality: 100 });
});

test("handleImageConversion handles NaN quality", async () => {
  const buffer = new ArrayBuffer(1024);
  const options = { url: "test.jpg", quality: NaN };

  await handleImageConversion(buffer, options);

  expect(mockWebp).toHaveBeenCalledWith({ quality: 100 });
});

test("handleImageConversion handles NaN width and height", async () => {
  const buffer = new ArrayBuffer(1024);
  const options = {
    url: "test.jpg",
    width: NaN as any,
    height: NaN as any,
  };

  await handleImageConversion(buffer, options);

  // Should not call resize since width and height are NaN
  expect(mockResize).not.toHaveBeenCalled();
  expect(mockWebp).toHaveBeenCalledWith({ quality: 100 });
});

test("handleImageConversion handles string width and height", async () => {
  const buffer = new ArrayBuffer(1024);
  const options = {
    url: "test.jpg",
    width: "800" as any,
    height: "600" as any,
  };

  await handleImageConversion(buffer, options);

  expect(mockResize).toHaveBeenCalledWith({ width: 800, height: 600 });
});

test("handleImageConversion handles invalid string dimensions", async () => {
  const buffer = new ArrayBuffer(1024);
  const options = {
    url: "test.jpg",
    width: "invalid" as any,
    height: "also-invalid" as any,
  };

  await handleImageConversion(buffer, options);

  // Resize is called but with empty options since both dimensions are invalid
  expect(mockResize).toHaveBeenCalledWith({});
  expect(mockWebp).toHaveBeenCalledWith({ quality: 100 });
});

test("handleImageConversion combines all options", async () => {
  const buffer = new ArrayBuffer(1024);
  const options = {
    url: "test.jpg",
    width: 1200,
    height: 800,
    quality: 85,
  };

  await handleImageConversion(buffer, options);

  expect(mockSharp).toHaveBeenCalledWith(Buffer.from(buffer));
  expect(mockResize).toHaveBeenCalledWith({ width: 1200, height: 800 });
  expect(mockWebp).toHaveBeenCalledWith({ quality: 85 });
  expect(mockToBuffer).toHaveBeenCalled();
});

test("handleImageConversion handles empty buffer", async () => {
  const buffer = new ArrayBuffer(0);
  const options = { url: "test.jpg" };

  await handleImageConversion(buffer, options);

  expect(mockSharp).toHaveBeenCalledWith(Buffer.from(buffer));
  expect(mockToBuffer).toHaveBeenCalled();
});

test("handleImageConversion propagates Sharp errors", async () => {
  const buffer = new ArrayBuffer(1024);
  const options = { url: "test.jpg" };
  const error = new Error("Sharp processing failed");

  mockToBuffer.mockRejectedValueOnce(error);

  await expect(handleImageConversion(buffer, options)).rejects.toThrow(
    "Sharp processing failed",
  );
});
