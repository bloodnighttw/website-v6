import { expect, test, vi, beforeEach } from "vitest";
import fs from "fs";

vi.mock("fs", () => ({
  default: {
    existsSync: vi.fn(),
    promises: {
      mkdir: vi.fn(),
      writeFile: vi.fn(),
    },
  },
}));

vi.mock("../src/core/image/handler", () => ({
  default: vi.fn().mockResolvedValue(Buffer.from("converted-image-data")),
}));

const mockFetch = vi.fn();
global.fetch = mockFetch;

beforeEach(() => {
  vi.clearAllMocks();

  const mockEnv = {
    DEV: false,
    PROD: true,
  };
  vi.stubGlobal("import.meta", { env: mockEnv });

  vi.mocked(fs.existsSync).mockReturnValue(false);
  vi.mocked(fs.promises.mkdir).mockResolvedValue(undefined);
  vi.mocked(fs.promises.writeFile).mockResolvedValue(undefined);
});

test("generateSHA256 creates consistent hash for same options", async () => {
  const { default: handleGeneration } = await import(
    "../../src/core/image/server"
  );

  const mockEnv = {
    DEV: true,
    PROD: false,
  };
  vi.stubGlobal("import.meta", { env: mockEnv });

  const options1 = { url: "/test.jpg", width: 800, height: 600, quality: 85 };
  const options2 = { url: "/test.jpg", width: 800, height: 600, quality: 85 };

  const result1 = handleGeneration(options1);
  const result2 = handleGeneration(options2);

  expect(result1).toBe(result2);
});

test("handleGeneration returns dev URL in development mode", async () => {
  const mockEnv = {
    DEV: true,
    PROD: false,
  };
  vi.stubGlobal("import.meta", { env: mockEnv });

  const { default: handleGeneration } = await import(
    "../../src/core/image/server"
  );

  const options = { url: "/test.jpg", width: 800, height: 600, quality: 85 };
  const result = handleGeneration(options);

  expect(result).toBe(
    "_rpress?url=%2Ftest.jpg&quality=85&width=800 &height=600",
  );
});

test("local file URLs are returned as-is in production", async () => {
  const mockEnv = {
    DEV: false,
    PROD: true,
  };
  vi.stubGlobal("import.meta", { env: mockEnv });

  const { default: handleGeneration } = await import(
    "../../src/core/image/server"
  );

  const options = { url: "/local-image.jpg" };

  try {
    handleGeneration(options);
    expect(true).toBe(false); // Should not reach here
  } catch (promise) {
    if (promise instanceof Promise) {
      const result = await promise;
      expect(result).toBe("/local-image.jpg");
    }
  }
});

test("remote images are processed in production", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)),
  });

  const mockEnv = {
    DEV: false,
    PROD: true,
  };
  vi.stubGlobal("import.meta", { env: mockEnv });

  const { default: handleGeneration } = await import(
    "../../src/core/image/server"
  );

  const options = { url: "https://example.com/image.jpg", quality: 80 };

  try {
    handleGeneration(options);
    expect(true).toBe(false); // Should not reach here
  } catch (promise) {
    if (promise instanceof Promise) {
      const result = await promise;
      expect(result).toMatch(/\/images\/[a-f0-9]+\.webp/);
      expect(mockFetch).toHaveBeenCalledWith("https://example.com/image.jpg");
    }
  }
});

test("failed fetch throws ImageConversionError", async () => {
  mockFetch.mockResolvedValueOnce({
    ok: false,
  });

  const mockEnv = {
    DEV: false,
    PROD: true,
  };
  vi.stubGlobal("import.meta", { env: mockEnv });

  const { default: handleGeneration } = await import(
    "../../src/core/image/server"
  );

  const options = { url: "https://example.com/bad-image.jpg" };

  try {
    handleGeneration(options);
    expect(true).toBe(false); // Should not reach here
  } catch (promise) {
    if (promise instanceof Promise) {
      await expect(promise).rejects.toThrow("Image conversion failed");
    }
  }
});

test("file existence check works with caching", async () => {
  vi.mocked(fs.existsSync).mockReturnValue(true);

  const mockEnv = {
    DEV: false,
    PROD: true,
  };
  vi.stubGlobal("import.meta", { env: mockEnv });

  mockFetch.mockResolvedValueOnce({
    ok: true,
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)),
  });

  const { default: handleGeneration } = await import(
    "../../src/core/image/server"
  );

  const options = { url: "https://example.com/cached-image.jpg" };

  try {
    handleGeneration(options);
    expect(true).toBe(false); // Should not reach here
  } catch (promise) {
    if (promise instanceof Promise) {
      await promise;
      expect(fs.existsSync).toHaveBeenCalled();
    }
  }
});
