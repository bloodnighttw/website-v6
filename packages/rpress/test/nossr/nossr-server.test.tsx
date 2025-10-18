import { expect, test, vi, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Suspense } from "react";

// Mock client-env as false to simulate server-side rendering
vi.mock("virtual:rpress:client-env", () => ({
  default: false,
}));

import NoSSR from "@/libs/nossr";

beforeEach(() => {
  vi.clearAllMocks();
  cleanup();
});

test("NoSSR throws error on server-side (client-env false)", () => {
  // The NoSSRError should be thrown when rendering on server-side
  expect(() => {
    render(
      <NoSSR fallback={<div>Server fallback</div>}>
        <div>Client-only content</div>
      </NoSSR>,
    );
  }).toThrow("A Error that should be caught by framework: NoSSR");

  expect(() => {
    render(
      <NoSSR>
        <div>Client content</div>
      </NoSSR>,
    );
  }).toThrow("NoSSR");
});

test("NoSSR error has correct type and message", () => {
  try {
    render(
      <NoSSR>
        <div>Client content</div>
      </NoSSR>,
    );
  } catch (error: any) {
    expect(error.message).toBe(
      "A Error that should be caught by framework: NoSSR",
    );
    expect(error.constructor.name).toBe("NoSSRError");
  }
});
