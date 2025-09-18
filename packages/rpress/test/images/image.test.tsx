import { expect, test } from "vitest";
import { render } from "@testing-library/react";
import Image from "@/libs/image";

test("Image component renders with basic props", () => {
  const { container } = render(<Image src="/test.jpg" alt="Test image" />);

  const img = container.querySelector("img");
  expect(img).toBeTruthy();
  expect(img?.src).toContain("/optimized?url=%2Ftest.jpg");
  expect(img?.alt).toBe("Test image");
});

test("Image component handles width and height", () => {
  const { container } = render(
    <Image src="/test.jpg" width={800} height={600} alt="Test image" />,
  );

  const img = container.querySelector("img");
  expect(img?.src).toContain("w=800");
  expect(img?.src).toContain("h=600");
  expect(img?.width).toBe(800);
  expect(img?.height).toBe(600);
});

test("Image component handles quality parameter", () => {
  const { container } = render(
    <Image src="/test.jpg" quality={85} alt="Test image" />,
  );

  const img = container.querySelector("img");
  expect(img?.src).toContain("q=85");
});

test("Image component passes through additional props", () => {
  const { container } = render(
    <Image
      src="/test.jpg"
      alt="Test image"
      className="custom-class"
      loading="lazy"
      style={{ border: "1px solid red" }}
    />,
  );

  const img = container.querySelector("img");
  expect(img?.className).toBe("custom-class");
  expect(img?.getAttribute("loading")).toBe("lazy");
  expect(img?.style.border).toBe("1px solid red");
});

test("Image component handles all parameters together", () => {
  const { container } = render(
    <Image
      src="/complex-test.jpg"
      width={1200}
      height={800}
      quality={90}
      alt="Complex test image"
      className="hero-image"
    />,
  );

  const img = container.querySelector("img");
  expect(img?.src).toContain("url=%2Fcomplex-test.jpg");
  expect(img?.src).toContain("w=1200");
  expect(img?.src).toContain("h=800");
  expect(img?.src).toContain("q=90");
  expect(img?.width).toBe(1200);
  expect(img?.height).toBe(800);
  expect(img?.alt).toBe("Complex test image");
  expect(img?.className).toBe("hero-image");
});

test("Image component works without optional parameters", () => {
  const { container } = render(<Image src="/minimal.jpg" />);

  const img = container.querySelector("img");
  expect(img?.src).toContain("/optimized?url=%2Fminimal.jpg");
  expect(img?.src).not.toContain("w=");
  expect(img?.src).not.toContain("h=");
  expect(img?.src).not.toContain("q=");
});
