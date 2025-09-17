import { expect, test, vi } from "vitest";
import loader from "../../src/core/image/client";

test("client loader returns original URL", () => {
  const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

  const result = loader({ url: "/test.jpg" });

  expect(result).toBe("/test.jpg");
  expect(consoleSpy).toHaveBeenCalledWith(
    "image convert cannot be done inside non-ssr component",
  );

  consoleSpy.mockRestore();
});

test("client loader ignores optimization parameters", () => {
  const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

  const result = loader({
    url: "/test.jpg",
    width: 800,
    height: 600,
    quality: 85,
  });

  expect(result).toBe("/test.jpg");
  expect(consoleSpy).toHaveBeenCalledWith(
    "image convert cannot be done inside non-ssr component",
  );

  consoleSpy.mockRestore();
});

test("client loader handles various URL formats", () => {
  const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

  expect(loader({ url: "https://example.com/image.jpg" })).toBe(
    "https://example.com/image.jpg",
  );
  expect(loader({ url: "/assets/image.png" })).toBe("/assets/image.png");
  expect(loader({ url: "image.webp" })).toBe("image.webp");

  consoleSpy.mockRestore();
});
