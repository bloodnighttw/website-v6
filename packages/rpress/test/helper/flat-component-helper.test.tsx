import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import React from "react";
import { FlatComponentHelper } from "@/libs/helper/flat-component-helper";

const TestProvider1: React.FC<{ value: string; children: React.ReactNode }> = ({
  value,
  children,
}) => (
  <div data-testid="provider1" data-value={value}>
    {children}
  </div>
);

const TestProvider2: React.FC<{ theme: string; children: React.ReactNode }> = ({
  theme,
  children,
}) => (
  <div data-testid="provider2" data-theme={theme}>
    {children}
  </div>
);

const TestProvider3: React.FC<{ mode: string; children: React.ReactNode }> = ({
  mode,
  children,
}) => (
  <div data-testid="provider3" data-mode={mode}>
    {children}
  </div>
);

afterEach(() => {
  cleanup();
});

test("creates empty helper", () => {
  const helper = new FlatComponentHelper();
  const Wrapper = helper.flatten();

  render(
    <Wrapper>
      <div data-testid="content">Test Content</div>
    </Wrapper>,
  );

  expect(screen.getByTestId("content")).toBeInTheDocument();
});

test("adds single component with props", () => {
  const helper = new FlatComponentHelper();
  helper.add(TestProvider1, { value: "test" });

  const Wrapper = helper.flatten();

  render(
    <Wrapper>
      <div data-testid="content">Test Content</div>
    </Wrapper>,
  );

  expect(screen.getByTestId("provider1")).toBeInTheDocument();
  expect(screen.getByTestId("provider1")).toHaveAttribute("data-value", "test");
  expect(screen.getByTestId("content")).toBeInTheDocument();
});

test("adds multiple components in correct order", () => {
  const helper = new FlatComponentHelper();
  helper.add(TestProvider1, { value: "first" });
  helper.add(TestProvider2, { theme: "dark" });
  helper.add(TestProvider3, { mode: "production" });

  const Wrapper = helper.flatten();

  render(
    <Wrapper>
      <div data-testid="content">Test Content</div>
    </Wrapper>,
  );

  const provider1 = screen.getByTestId("provider1");
  const provider2 = screen.getByTestId("provider2");
  const provider3 = screen.getByTestId("provider3");
  const content = screen.getByTestId("content");

  expect(provider1).toBeInTheDocument();
  expect(provider2).toBeInTheDocument();
  expect(provider3).toBeInTheDocument();
  expect(content).toBeInTheDocument();

  expect(provider1).toHaveAttribute("data-value", "first");
  expect(provider2).toHaveAttribute("data-theme", "dark");
  expect(provider3).toHaveAttribute("data-mode", "production");

  expect(provider1).toContainElement(provider2);
  expect(provider2).toContainElement(provider3);
  expect(provider3).toContainElement(content);
});

test("handles component without props", () => {
  const helper = new FlatComponentHelper();
  const SimpleWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => <div data-testid="simple-wrapper">{children}</div>;

  helper.add(SimpleWrapper, {});

  const Wrapper = helper.flatten();

  render(
    <Wrapper>
      <div data-testid="content">Test Content</div>
    </Wrapper>,
  );

  expect(screen.getByTestId("simple-wrapper")).toBeInTheDocument();
  expect(screen.getByTestId("content")).toBeInTheDocument();
});

test("handles undefined props", () => {
  const helper = new FlatComponentHelper();
  const SimpleWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => <div data-testid="simple-wrapper">{children}</div>;

  helper.add(SimpleWrapper, undefined as any);

  const Wrapper = helper.flatten();

  render(
    <Wrapper>
      <div data-testid="content">Test Content</div>
    </Wrapper>,
  );

  expect(screen.getByTestId("simple-wrapper")).toBeInTheDocument();
  expect(screen.getByTestId("content")).toBeInTheDocument();
});

test("creates immutable snapshots", () => {
  const helper = new FlatComponentHelper();
  helper.add(TestProvider1, { value: "first" });

  const Wrapper1 = helper.flatten();

  helper.add(TestProvider2, { theme: "dark" });

  const Wrapper2 = helper.flatten();

  render(
    <Wrapper1>
      <div data-testid="content1">Content 1</div>
    </Wrapper1>,
  );

  expect(screen.getByTestId("provider1")).toBeInTheDocument();
  expect(screen.queryByTestId("provider2")).not.toBeInTheDocument();

  cleanup();

  render(
    <Wrapper2>
      <div data-testid="content2">Content 2</div>
    </Wrapper2>,
  );

  expect(screen.getByTestId("provider1")).toBeInTheDocument();
  expect(screen.getByTestId("provider2")).toBeInTheDocument();
});

// static compose method tests
test("creates helper from empty array", () => {
  const helper = FlatComponentHelper.compose([]);
  const Wrapper = helper.flatten();

  render(
    <Wrapper>
      <div data-testid="content">Test Content</div>
    </Wrapper>,
  );

  expect(screen.getByTestId("content")).toBeInTheDocument();
});

test("creates helper from array of wrappers", () => {
  const wrappers = [
    { component: TestProvider1, props: { value: "composed" } },
    { component: TestProvider2, props: { theme: "light" } },
    { component: TestProvider3, props: { mode: "development" } },
  ];

  const helper = FlatComponentHelper.compose(wrappers);
  const Wrapper = helper.flatten();

  render(
    <Wrapper>
      <div data-testid="content">Test Content</div>
    </Wrapper>,
  );

  const provider1 = screen.getByTestId("provider1");
  const provider2 = screen.getByTestId("provider2");
  const provider3 = screen.getByTestId("provider3");
  const content = screen.getByTestId("content");

  expect(provider1).toHaveAttribute("data-value", "composed");
  expect(provider2).toHaveAttribute("data-theme", "light");
  expect(provider3).toHaveAttribute("data-mode", "development");

  expect(provider1).toContainElement(provider2);
  expect(provider2).toContainElement(provider3);
  expect(provider3).toContainElement(content);
});

test("handles wrappers without props", () => {
  const SimpleWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => <div data-testid="simple-wrapper">{children}</div>;

  const wrappers = [
    { component: SimpleWrapper },
    { component: TestProvider1, props: { value: "test" } },
  ];

  const helper = FlatComponentHelper.compose(wrappers);
  const Wrapper = helper.flatten();

  render(
    <Wrapper>
      <div data-testid="content">Test Content</div>
    </Wrapper>,
  );

  expect(screen.getByTestId("simple-wrapper")).toBeInTheDocument();
  expect(screen.getByTestId("provider1")).toBeInTheDocument();
  expect(screen.getByTestId("provider1")).toHaveAttribute("data-value", "test");
});

test("handles undefined props in wrappers array", () => {
  const SimpleWrapper: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => <div data-testid="simple-wrapper">{children}</div>;

  const wrappers = [
    { component: SimpleWrapper, props: undefined },
    { component: TestProvider1, props: { value: "test" } },
  ];

  const helper = FlatComponentHelper.compose(wrappers);
  const Wrapper = helper.flatten();

  render(
    <Wrapper>
      <div data-testid="content">Test Content</div>
    </Wrapper>,
  );

  expect(screen.getByTestId("simple-wrapper")).toBeInTheDocument();
  expect(screen.getByTestId("provider1")).toBeInTheDocument();
});

test("preserves component props types", () => {
  const helper = new FlatComponentHelper();

  helper.add(TestProvider1, { value: "typed-test" });

  const Wrapper = helper.flatten();

  render(
    <Wrapper>
      <div data-testid="content">Test Content</div>
    </Wrapper>,
  );

  expect(screen.getByTestId("provider1")).toHaveAttribute(
    "data-value",
    "typed-test",
  );
});

test("works with complex nested structure", () => {
  const ErrorBoundary: React.FC<{
    fallback: string;
    children: React.ReactNode;
  }> = ({ fallback, children }) => (
    <div data-testid="error-boundary" data-fallback={fallback}>
      {children}
    </div>
  );

  const ThemeProvider: React.FC<{
    theme: string;
    children: React.ReactNode;
  }> = ({ theme, children }) => (
    <div data-testid="theme-provider" data-theme={theme}>
      {children}
    </div>
  );

  const helper = new FlatComponentHelper();
  helper.add(ErrorBoundary, { fallback: "Error occurred" });
  helper.add(ThemeProvider, { theme: "dark" });
  helper.add(TestProvider1, { value: "nested" });

  const Wrapper = helper.flatten();

  render(
    <Wrapper>
      <div data-testid="app">
        <div data-testid="header">Header</div>
        <div data-testid="main">Main Content</div>
      </div>
    </Wrapper>,
  );

  const errorBoundary = screen.getByTestId("error-boundary");
  const themeProvider = screen.getByTestId("theme-provider");
  const provider1 = screen.getByTestId("provider1");
  const app = screen.getByTestId("app");

  expect(errorBoundary).toContainElement(themeProvider);
  expect(themeProvider).toContainElement(provider1);
  expect(provider1).toContainElement(app);

  expect(errorBoundary).toHaveAttribute("data-fallback", "Error occurred");
  expect(themeProvider).toHaveAttribute("data-theme", "dark");
  expect(provider1).toHaveAttribute("data-value", "nested");
});
