import { expect, test, vi, beforeEach, afterEach } from "vitest";
import { renderHook, cleanup } from "@testing-library/react";
import { type ReactNode } from "react";
import useNavigate from "@/libs/route/navigate";
import RouteContext from "@/libs/route/context";

beforeEach(() => {
  vi.clearAllMocks();
  cleanup();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test("useNavigate returns setUrl function from context", () => {
  const mockSetUrl = vi.fn();

  const wrapper = ({ children }: { children: ReactNode }) => (
    <RouteContext.Provider value={{ setUrl: mockSetUrl }}>
      {children}
    </RouteContext.Provider>
  );

  const { result } = renderHook(() => useNavigate(), { wrapper });

  expect(result.current).toBe(mockSetUrl);
  expect(typeof result.current).toBe("function");
});

test("useNavigate function calls setUrl with correct arguments", () => {
  const mockSetUrl = vi.fn();

  const wrapper = ({ children }: { children: ReactNode }) => (
    <RouteContext.Provider value={{ setUrl: mockSetUrl }}>
      {children}
    </RouteContext.Provider>
  );

  const { result } = renderHook(() => useNavigate(), { wrapper });

  // Test navigation to different URLs
  result.current("/home");
  expect(mockSetUrl).toHaveBeenCalledWith("/home");

  result.current("/about");
  expect(mockSetUrl).toHaveBeenCalledWith("/about");

  result.current("/users/123");
  expect(mockSetUrl).toHaveBeenCalledWith("/users/123");

  expect(mockSetUrl).toHaveBeenCalledTimes(3);
});

test("useNavigate throws error when used outside RouteContext provider", () => {
  // Mock console.error to prevent error log in test output
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  const { result } = renderHook(() => useNavigate());

  // The error is thrown when the returned function is called, not when the hook is used
  expect(() => {
    result.current("/some-url");
  }).toThrow("setUrl called outside of RouteContext provider");

  consoleErrorSpy.mockRestore();
});

test("useNavigate works with different URL formats", () => {
  const mockSetUrl = vi.fn();

  const wrapper = ({ children }: { children: ReactNode }) => (
    <RouteContext.Provider value={{ setUrl: mockSetUrl }}>
      {children}
    </RouteContext.Provider>
  );

  const { result } = renderHook(() => useNavigate(), { wrapper });

  // Test various URL formats
  result.current("/");
  result.current("/dashboard");
  result.current("/users/profile");
  result.current("/search?q=test");
  result.current("/page#section");
  result.current("https://external.com");

  expect(mockSetUrl).toHaveBeenCalledWith("/");
  expect(mockSetUrl).toHaveBeenCalledWith("/dashboard");
  expect(mockSetUrl).toHaveBeenCalledWith("/users/profile");
  expect(mockSetUrl).toHaveBeenCalledWith("/search?q=test");
  expect(mockSetUrl).toHaveBeenCalledWith("/page#section");
  expect(mockSetUrl).toHaveBeenCalledWith("https://external.com");
  expect(mockSetUrl).toHaveBeenCalledTimes(6);
});

test("useNavigate function identity remains stable across re-renders", () => {
  const mockSetUrl = vi.fn();

  const wrapper = ({ children }: { children: ReactNode }) => (
    <RouteContext.Provider value={{ setUrl: mockSetUrl }}>
      {children}
    </RouteContext.Provider>
  );

  const { result, rerender } = renderHook(() => useNavigate(), { wrapper });
  const firstNavigate = result.current;

  rerender();
  const secondNavigate = result.current;

  // The function should remain the same reference
  expect(firstNavigate).toBe(secondNavigate);
  expect(firstNavigate).toBe(mockSetUrl);
});

test("useNavigate works with context value changes", () => {
  const mockSetUrl1 = vi.fn();
  const mockSetUrl2 = vi.fn();

  let currentSetUrl = mockSetUrl1;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <RouteContext.Provider value={{ setUrl: currentSetUrl }}>
      {children}
    </RouteContext.Provider>
  );

  const { result, rerender } = renderHook(() => useNavigate(), { wrapper });

  // Test with first setUrl function
  result.current("/first");
  expect(mockSetUrl1).toHaveBeenCalledWith("/first");
  expect(mockSetUrl2).not.toHaveBeenCalled();

  // Change the context value
  currentSetUrl = mockSetUrl2;
  rerender();

  // Test with second setUrl function
  result.current("/second");
  expect(mockSetUrl2).toHaveBeenCalledWith("/second");
  expect(mockSetUrl1).toHaveBeenCalledTimes(1); // Should still be 1
});

test("useNavigate handles empty and special string values", () => {
  const mockSetUrl = vi.fn();

  const wrapper = ({ children }: { children: ReactNode }) => (
    <RouteContext.Provider value={{ setUrl: mockSetUrl }}>
      {children}
    </RouteContext.Provider>
  );

  const { result } = renderHook(() => useNavigate(), { wrapper });

  // Test edge cases
  result.current("");
  result.current("   ");
  result.current("../relative");
  result.current("./current");

  expect(mockSetUrl).toHaveBeenCalledWith("");
  expect(mockSetUrl).toHaveBeenCalledWith("   ");
  expect(mockSetUrl).toHaveBeenCalledWith("../relative");
  expect(mockSetUrl).toHaveBeenCalledWith("./current");
  expect(mockSetUrl).toHaveBeenCalledTimes(4);
});

test("useNavigate context provider can be nested", () => {
  const outerSetUrl = vi.fn();
  const innerSetUrl = vi.fn();

  const OuterWrapper = ({ children }: { children: ReactNode }) => (
    <RouteContext.Provider value={{ setUrl: outerSetUrl }}>
      {children}
    </RouteContext.Provider>
  );

  const InnerWrapper = ({ children }: { children: ReactNode }) => (
    <OuterWrapper>
      <RouteContext.Provider value={{ setUrl: innerSetUrl }}>
        {children}
      </RouteContext.Provider>
    </OuterWrapper>
  );

  const { result } = renderHook(() => useNavigate(), { wrapper: InnerWrapper });

  // Should use the inner (closest) provider
  result.current("/nested");
  expect(innerSetUrl).toHaveBeenCalledWith("/nested");
  expect(outerSetUrl).not.toHaveBeenCalled();
});
