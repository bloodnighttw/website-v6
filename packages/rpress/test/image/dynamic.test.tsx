import { expect, test, vi, beforeEach, describe } from "vitest";
import { render, cleanup } from "@testing-library/react";
import Image from "@/libs/image";

vi.mock("virtual:rpress:client-env", () => ({
  default: true,
}));

vi.mock("virtual:rpress:image:mode", () => ({
  default: "dynamic",
}));

vi.mock("virtual:rpress:config", () => ({
  default: { imgBaseURL: "img" },
}));

beforeEach(() => {
  vi.clearAllMocks();
  cleanup();
});

describe("Image component - dynamic mode (dev)", () => {
  test("renders remote image with query parameters", () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" alt="Test image" />,
    );

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("alt", "Test image");
    const src = img?.getAttribute("src");
    expect(src).toContain("/img?url=");
    expect(src).toContain(encodeURIComponent("https://example.com/image.jpg"));
  });

  test("renders remote image with width parameter", () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" width={800} alt="Test" />,
    );

    const img = container.querySelector("img");
    const src = img?.getAttribute("src");
    expect(src).toContain("width=800");
    expect(img).toHaveAttribute("width", "800");
  });

  test("renders remote image with height parameter", () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" height={600} alt="Test" />,
    );

    const img = container.querySelector("img");
    const src = img?.getAttribute("src");
    expect(src).toContain("height=600");
    expect(img).toHaveAttribute("height", "600");
  });

  test("renders remote image with quality parameter", () => {
    const { container } = render(
      <Image src="https://example.com/image.jpg" quality={80} alt="Test" />,
    );

    const img = container.querySelector("img");
    const src = img?.getAttribute("src");
    expect(src).toContain("quality=80");
  });

  test("renders remote image with all parameters", () => {
    const { container } = render(
      <Image
        src="https://example.com/image.jpg"
        width={1200}
        height={800}
        quality={90}
        alt="Full options"
      />,
    );

    const img = container.querySelector("img");
    const src = img?.getAttribute("src");
    expect(src).toContain("width=1200");
    expect(src).toContain("height=800");
    expect(src).toContain("quality=90");
    expect(src).toContain(encodeURIComponent("https://example.com/image.jpg"));
  });

  test("renders local image with query parameters", () => {
    const { container } = render(
      <Image src="/images/local.png" alt="Local image" />,
    );

    const img = container.querySelector("img");
    const src = img?.getAttribute("src");
    expect(src).toContain("/img?url=");
    expect(src).toContain(encodeURIComponent("/images/local.png"));
  });

  test("renders local image with dimensions", () => {
    const { container } = render(
      <Image src="/photos/test.jpg" width={400} height={300} alt="Local" />,
    );

    const img = container.querySelector("img");
    const src = img?.getAttribute("src");
    expect(src).toContain("width=400");
    expect(src).toContain("height=300");
    expect(src).toContain(encodeURIComponent("/photos/test.jpg"));
  });

  test("renders local image with quality", () => {
    const { container } = render(
      <Image src="/assets/photo.jpg" quality={75} alt="Quality" />,
    );

    const img = container.querySelector("img");
    const src = img?.getAttribute("src");
    expect(src).toContain("quality=75");
    expect(src).toContain(encodeURIComponent("/assets/photo.jpg"));
  });

  test("does not process relative paths in dynamic mode", () => {
    const { container } = render(
      <Image src="relative/image.png" alt="Relative" />,
    );

    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "relative/image.png");
  });

  test("does not process data URLs in dynamic mode", () => {
    const dataUrl =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const { container } = render(<Image src={dataUrl} alt="Data URL" />);

    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", dataUrl);
  });

  test("generates correct URL format without optional parameters", () => {
    const { container } = render(
      <Image src="https://cdn.example.com/photo.jpg" alt="Basic" />,
    );

    const img = container.querySelector("img");
    const src = img?.getAttribute("src");
    expect(src).toMatch(
      /^\/img\?url=https%3A%2F%2Fcdn\.example\.com%2Fphoto\.jpg$/,
    );
  });

  test("does not add __RPRESS_IMAGES__ in dynamic mode", () => {
    globalThis.__RPRESS_IMAGES__ = [];

    render(
      <Image
        src="https://example.com/test.jpg"
        width={800}
        quality={85}
        alt="Test"
      />,
    );

    expect(globalThis.__RPRESS_IMAGES__?.length).toBe(0);
  });
});
