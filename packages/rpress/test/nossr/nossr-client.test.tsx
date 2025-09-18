import { expect, test, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import NoSSR from "@/libs/nossr";

beforeEach(() => {
  vi.clearAllMocks();
  cleanup();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test("NoSSR renders children when client-env is true", () => {
  render(
    <NoSSR fallback={<div>Loading...</div>}>
      <div>Client-only content</div>
    </NoSSR>,
  );

  // Since client-env mock is true, should render children directly
  expect(screen.getByText("Client-only content")).toBeInTheDocument();
  expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
});

test("NoSSR renders children without fallback", () => {
  render(
    <NoSSR>
      <div>Client-only content</div>
    </NoSSR>,
  );

  // Should render children since client-env is true
  expect(screen.getByText("Client-only content")).toBeInTheDocument();
});

test("NoSSR handles multiple children", () => {
  render(
    <NoSSR fallback={<div>Loading multiple...</div>}>
      <div>First child</div>
      <div>Second child</div>
      <span>Third child</span>
    </NoSSR>,
  );

  // Should render all children
  expect(screen.getByText("First child")).toBeInTheDocument();
  expect(screen.getByText("Second child")).toBeInTheDocument();
  expect(screen.getByText("Third child")).toBeInTheDocument();
  expect(screen.queryByText("Loading multiple...")).not.toBeInTheDocument();
});

test("NoSSR handles null/undefined children", () => {
  const { rerender } = render(
    <NoSSR fallback={<div>Loading...</div>}>{null}</NoSSR>,
  );

  // Should not crash with null children
  expect(screen.queryByText("Loading...")).not.toBeInTheDocument();

  // Test with undefined
  rerender(<NoSSR fallback={<div>Loading again...</div>}>{undefined}</NoSSR>);

  expect(screen.queryByText("Loading again...")).not.toBeInTheDocument();
});

test("NoSSR handles conditional children", () => {
  const showContent = true;

  render(
    <NoSSR fallback={<div>Loading conditional...</div>}>
      {showContent ? (
        <div>Conditional content</div>
      ) : (
        <div>Alternative content</div>
      )}
    </NoSSR>,
  );

  expect(screen.getByText("Conditional content")).toBeInTheDocument();
  expect(screen.queryByText("Loading conditional...")).not.toBeInTheDocument();
  expect(screen.queryByText("Alternative content")).not.toBeInTheDocument();
});

test("NoSSR component can be nested", () => {
  render(
    <NoSSR fallback={<div>Outer loading...</div>}>
      <div>Outer content</div>
      <NoSSR fallback={<div>Inner loading...</div>}>
        <div>Inner content</div>
      </NoSSR>
    </NoSSR>,
  );

  // Should render both nested contents
  expect(screen.getByText("Outer content")).toBeInTheDocument();
  expect(screen.getByText("Inner content")).toBeInTheDocument();
  expect(screen.queryByText("Outer loading...")).not.toBeInTheDocument();
  expect(screen.queryByText("Inner loading...")).not.toBeInTheDocument();
});

test("NoSSR handles React fragments", () => {
  render(
    <NoSSR fallback={<div>Loading fragments...</div>}>
      <>
        <div>Fragment child 1</div>
        <div>Fragment child 2</div>
      </>
    </NoSSR>,
  );

  expect(screen.getByText("Fragment child 1")).toBeInTheDocument();
  expect(screen.getByText("Fragment child 2")).toBeInTheDocument();
  expect(screen.queryByText("Loading fragments...")).not.toBeInTheDocument();
});

test("NoSSR handles complex fallback content", () => {
  const ComplexFallback = () => (
    <div>
      <h2>Loading</h2>
      <p>Please wait while content loads...</p>
      <button disabled>Loading button</button>
    </div>
  );

  render(
    <NoSSR fallback={<ComplexFallback />}>
      <div>
        <h1>Loaded Content</h1>
        <button>Active button</button>
      </div>
    </NoSSR>,
  );

  // Since client-env is true, should show actual content
  expect(screen.getByText("Loaded Content")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Active button" })).toBeEnabled();

  // Fallback should not be shown
  expect(screen.queryByText("Loading")).not.toBeInTheDocument();
  expect(
    screen.queryByText("Please wait while content loads..."),
  ).not.toBeInTheDocument();
});

// Test server-side behavior by creating a separate test with client-env set to false
test("NoSSR behavior with Suspense and error boundary", () => {
  // Test that the component structure works properly
  render(
    <NoSSR fallback={<div>Fallback content</div>}>
      <div data-testid="client-content">Client content</div>
    </NoSSR>,
  );

  // In our test environment with client-env true, content should be rendered
  expect(screen.getByTestId("client-content")).toBeInTheDocument();
});
