import { expect, test, vi, beforeEach, describe } from "vitest";
import { render, cleanup } from "@testing-library/react";
import Image from "@/libs/image";

vi.mock("virtual:rpress:client-env", () => ({
  default: true,
}));

vi.mock("virtual:rpress:image:mode", () => ({
  default: "generation",
}));

vi.mock("virtual:rpress:config", () => ({
  default: { imgBaseURL: "img" },
}));

beforeEach(() => {
  vi.clearAllMocks();
  cleanup();
  globalThis.__RPRESS_IMAGES__ = [];
});

describe("Image component - remote images", () => {
  test("renders remote image with basic props", () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" alt="Test image" />,
    );

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("alt", "Test image");
    const src = img?.getAttribute("src");
    expect(src).toMatch(/\/img\//);
    expect(src).toMatch(/\.webp$/);
  });

  test("renders remote image with width and height", () => {
    const { container } = render(
      <Image
        src="https://example.com/image.jpg"
        width={800}
        height={600}
        alt="Test"
      />,
    );

    const img = container.querySelector("img");
    expect(img).toHaveAttribute("width", "800");
    expect(img).toHaveAttribute("height", "600");
  });

  test("renders remote image with quality parameter", () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" quality={80} alt="Test" />,
    );

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    const src = img?.getAttribute("src");
    expect(src).toMatch(/\/img\//);
    expect(src).toMatch(/\.webp$/);
  });

  test("renders remote image with all options", () => {
    const { container } = render(
      <Image
        src="https://example.com/image.jpg"
        width={1200}
        height={800}
        quality={90}
        alt="Full options test"
      />,
    );

    const img = container.querySelector("img");
    expect(img).toHaveAttribute("alt", "Full options test");
    expect(img).toHaveAttribute("width", "1200");
    expect(img).toHaveAttribute("height", "800");
    const src = img?.getAttribute("src");
    expect(src).toMatch(/\/img\//);
    expect(src).toMatch(/\.webp$/);
  });
});

describe("Image component - local images", () => {
  test("renders local image from public directory", () => {
    const { container } = render(
      <Image src="/images/local-image.png" alt="Local image" />,
    );

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("alt", "Local image");
    const src = img?.getAttribute("src");
    expect(src).toMatch(/\/img\//);
    expect(src).toMatch(/\.webp$/);
  });

  test("renders local image with dimensions", () => {
    const { container } = render(
      <Image
        src="/photos/test.jpg"
        width={400}
        height={300}
        alt="Local with size"
      />,
    );

    const img = container.querySelector("img");
    expect(img).toHaveAttribute("width", "400");
    expect(img).toHaveAttribute("height", "300");
    const src = img?.getAttribute("src");
    expect(src).toMatch(/\/img\//);
    expect(src).toMatch(/\.webp$/);
  });

  test("renders local image with quality", () => {
    const { container } = render(
      <Image src="/assets/photo.jpg" quality={75} alt="Quality test" />,
    );

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    const src = img?.getAttribute("src");
    expect(src).toMatch(/\/img\//);
    expect(src).toMatch(/\.webp$/);
  });
});

describe("Image component - other image types", () => {
  test("renders relative path without processing", () => {
    const { container } = render(
      <Image src="relative/image.png" alt="Relative" />,
    );

    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "relative/image.png");
  });

  test("renders data URL without processing", () => {
    const dataUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const { container } = render(<Image src={dataUrl} alt="Data URL" />);

    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", dataUrl);
  });

  test("passes through additional HTML attributes", () => {
    const { container } = render(
      <Image
        src="https://example.com/image.jpg"
        alt="Test"
        className="custom-class"
        loading="lazy"
        data-testid="custom-image"
      />,
    );

    const img = container.querySelector("img");
    expect(img).toHaveClass("custom-class");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("data-testid", "custom-image");
  });

  test("handles image with style attribute", () => {
    const { container } = render(
      <Image src="/test.jpg" alt="Styled" style={{ borderRadius: "8px" }} />,
    );

    const img = container.querySelector("img");
    expect(img).toHaveStyle({ borderRadius: "8px" });
  });
});

describe("Image component - generation mode", () => {
  test("adds image to global __RPRESS_IMAGES__ in generation mode", async () => {
    vi.resetModules();

    vi.mock("virtual:rpress:client-env", () => ({
      default: false,
    }));

    globalThis.__RPRESS_IMAGES__ = [];

    const { default: ImageSSR } = await import("@/libs/image");

    try {
      render(
        <ImageSSR
          src="https://example.com/test.jpg"
          width={800}
          height={600}
          quality={85}
          alt="SSR Test"
        />,
      );
    } catch (error) {}

    expect(globalThis.__RPRESS_IMAGES__?.length).toBeGreaterThan(0);
  });
});
