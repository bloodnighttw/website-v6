import { expect, test, vi, beforeEach, afterEach } from "vitest";
import { renderHook, cleanup, waitFor, act } from "@testing-library/react";
import { type ReactNode, useCallback, useState } from "react";
import useNavigate from "@/libs/route/navigate";
import RouteContext from "@/libs/route/context";

// Mock the rsc loader
const mockLoad = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  cleanup();

  // Mock window.history
  Object.defineProperty(window, "history", {
    value: {
      pushState: vi.fn(),
    },
    writable: true,
  });

  // Reset mock implementation
  mockLoad.mockResolvedValue({ root: <div>Mock Content</div> });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// Enhanced wrapper that simulates BrowserRoot's setUrl behavior
const EnhancedWrapper = ({ children }: { children: ReactNode }) => {
  const [_payload, setPayload] = useState({ root: <div>Initial Content</div> });

  const setUrl = useCallback((url: string) => {
    // Simulate the actual BrowserRoot setUrl behavior
    window.history.pushState({}, "", url);
    mockLoad(url)
      .then((newPayload: any) => {
        setPayload(newPayload);
      })
      .catch(() => {
        // Handle errors silently like the real implementation
      });
  }, []);

  return (
    <RouteContext.Provider value={{ setUrl }}>{children}</RouteContext.Provider>
  );
};

test("useNavigate with enhanced context calls load and updates history", async () => {
  const { result } = renderHook(() => useNavigate(), {
    wrapper: EnhancedWrapper,
  });

  // Test navigation
  await act(async () => {
    result.current("/enhanced-page");
  });

  await waitFor(() => {
    expect(mockLoad).toHaveBeenCalledWith("/enhanced-page");
  });

  expect(window.history.pushState).toHaveBeenCalledWith(
    {},
    "",
    "/enhanced-page",
  );
});

test("useNavigate handles async payload loading with transitions", async () => {
  const mockPayload = { root: <div>New Content</div> };
  mockLoad.mockResolvedValue(mockPayload);

  const { result } = renderHook(() => useNavigate(), {
    wrapper: EnhancedWrapper,
  });

  await act(async () => {
    result.current("/async-transition");
  });

  await waitFor(() => {
    expect(mockLoad).toHaveBeenCalledWith("/async-transition");
    expect(window.history.pushState).toHaveBeenCalledWith(
      {},
      "",
      "/async-transition",
    );
  });
});

test("useNavigate handles multiple sequential navigations", async () => {
  const mockPayload1 = { root: <div>Content 1</div> };
  const mockPayload2 = { root: <div>Content 2</div> };

  mockLoad
    .mockResolvedValueOnce(mockPayload1)
    .mockResolvedValueOnce(mockPayload2);

  const { result } = renderHook(() => useNavigate(), {
    wrapper: EnhancedWrapper,
  });

  // First navigation
  await act(async () => {
    result.current("/sequence-1");
  });

  // Second navigation
  await act(async () => {
    result.current("/sequence-2");
  });

  await waitFor(() => {
    expect(mockLoad).toHaveBeenCalledTimes(2);
    expect(mockLoad).toHaveBeenNthCalledWith(1, "/sequence-1");
    expect(mockLoad).toHaveBeenNthCalledWith(2, "/sequence-2");
    expect(window.history.pushState).toHaveBeenCalledTimes(2);
  });
});

test("useNavigate function identity remains stable with enhanced context", () => {
  const { result, rerender } = renderHook(() => useNavigate(), {
    wrapper: EnhancedWrapper,
  });

  const firstNavigate = result.current;

  rerender();
  const secondNavigate = result.current;

  // The setUrl function should remain stable due to useCallback
  expect(firstNavigate).toBe(secondNavigate);
});

test("useNavigate handles load function errors gracefully", async () => {
  const error = new Error("Load failed");
  mockLoad.mockRejectedValue(error);

  const { result } = renderHook(() => useNavigate(), {
    wrapper: EnhancedWrapper,
  });

  // Navigation should not throw even if load fails
  await act(async () => {
    result.current("/failing-page");
  });

  expect(mockLoad).toHaveBeenCalledWith("/failing-page");
  // History should still be updated even if load fails
  expect(window.history.pushState).toHaveBeenCalledWith(
    {},
    "",
    "/failing-page",
  );
});

test("useNavigate works with rapid successive calls", async () => {
  const mockPayloads = [
    { root: <div>Content A</div> },
    { root: <div>Content B</div> },
    { root: <div>Content C</div> },
  ];

  mockLoad
    .mockResolvedValueOnce(mockPayloads[0])
    .mockResolvedValueOnce(mockPayloads[1])
    .mockResolvedValueOnce(mockPayloads[2]);

  const { result } = renderHook(() => useNavigate(), {
    wrapper: EnhancedWrapper,
  });

  // Rapid navigation calls
  await act(async () => {
    result.current("/rapid-1");
    result.current("/rapid-2");
    result.current("/rapid-3");
  });

  await waitFor(() => {
    expect(mockLoad).toHaveBeenCalledTimes(3);
    expect(window.history.pushState).toHaveBeenCalledTimes(3);
  });

  expect(window.history.pushState).toHaveBeenNthCalledWith(
    1,
    {},
    "",
    "/rapid-1",
  );
  expect(window.history.pushState).toHaveBeenNthCalledWith(
    2,
    {},
    "",
    "/rapid-2",
  );
  expect(window.history.pushState).toHaveBeenNthCalledWith(
    3,
    {},
    "",
    "/rapid-3",
  );
});

test("useNavigate with complex URLs including query params and hashes", async () => {
  const { result } = renderHook(() => useNavigate(), {
    wrapper: EnhancedWrapper,
  });

  const complexUrl = "/search?q=test&category=all#results";

  await act(async () => {
    result.current(complexUrl);
  });

  await waitFor(() => {
    expect(mockLoad).toHaveBeenCalledWith(complexUrl);
    expect(window.history.pushState).toHaveBeenCalledWith({}, "", complexUrl);
  });
});

test("useNavigate handles slow loading scenarios", async () => {
  // Simulate slow loading
  const slowPromise = new Promise((resolve) =>
    setTimeout(() => resolve({ root: <div>Slow Content</div> }), 100),
  );
  mockLoad.mockReturnValue(slowPromise);

  const { result } = renderHook(() => useNavigate(), {
    wrapper: EnhancedWrapper,
  });

  await act(async () => {
    result.current("/slow-page");
  });

  // History should be updated immediately
  expect(window.history.pushState).toHaveBeenCalledWith({}, "", "/slow-page");

  // Load should have been called
  expect(mockLoad).toHaveBeenCalledWith("/slow-page");

  // Wait for the slow promise to resolve
  await waitFor(
    async () => {
      await expect(slowPromise).resolves.toBeDefined();
    },
    { timeout: 200 },
  );
});
