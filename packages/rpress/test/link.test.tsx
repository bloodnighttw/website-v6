import { expect, test, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import Link from "../src/core/link";
import RouteContext from "../src/core/route/context";
import mockLoad from "virtual:rpress:rsc-loader";

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
});
global.IntersectionObserver = mockIntersectionObserver;

const mockSetUrl = vi.fn();

const TestWrapper = ({
  children,
  prefetchStrategy = "hover",
}: {
  children: React.ReactNode;
  prefetchStrategy?: string;
}) => {
  vi.doMock("virtual:rpress:config", () => ({
    default: { prefetchStrategy },
  }));

  return (
    <RouteContext.Provider value={{ setUrl: mockSetUrl }}>
      {children}
    </RouteContext.Provider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

test("Link renders with basic props", () => {
  render(
    <TestWrapper>
      <Link to="/about">About</Link>
    </TestWrapper>,
  );

  const link = screen.getByText("About");
  expect(link).toHaveAttribute("href", "/about");
  expect(link).toHaveTextContent("About");
});

test("Link passes through additional props", () => {
  render(
    <TestWrapper>
      <Link to="/contact" className="nav-link" id="contact-link">
        Contact
      </Link>
    </TestWrapper>,
  );

  const link = screen.getByText("Contact");
  expect(link).toHaveAttribute("class", "nav-link");
  expect(link).toHaveAttribute("id", "contact-link");
});

test("Link navigates on click", () => {
  render(
    <TestWrapper>
      <Link to="/dashboard">Dashboard</Link>
    </TestWrapper>,
  );

  const link = screen.getByText("Dashboard");
  fireEvent.click(link);

  expect(mockSetUrl).toHaveBeenCalledWith("/dashboard");
});

test("Link prevents default click behavior", () => {
  const mockPreventDefault = vi.fn();

  render(
    <TestWrapper>
      <Link to="/home">Home</Link>
    </TestWrapper>,
  );

  const link = screen.getByText("Home");
  const clickEvent = new MouseEvent("click", { bubbles: true });
  clickEvent.preventDefault = mockPreventDefault;

  fireEvent(link, clickEvent);

  expect(mockPreventDefault).toHaveBeenCalled();
});

test("Link calls custom onClick handler", () => {
  const customOnClick = vi.fn();

  render(
    <TestWrapper>
      <Link to="/settings" onClick={customOnClick}>
        Settings
      </Link>
    </TestWrapper>,
  );

  const link = screen.getByText("Settings");
  fireEvent.click(link);

  expect(customOnClick).toHaveBeenCalled();
  expect(mockSetUrl).toHaveBeenCalledWith("/settings");
});

test("Link with hover prefetch loads on mouse enter", () => {
  render(
    <TestWrapper>
      <Link to="/profile" prefetch="hover">
        Profile
      </Link>
    </TestWrapper>,
  );

  const link = screen.getByText("Profile");
  fireEvent.mouseEnter(link);

  expect(mockLoad).toHaveBeenCalledWith("/profile");
});

test("Link calls custom onMouseEnter handler", () => {
  const customOnMouseEnter = vi.fn();

  render(
    <TestWrapper>
      <Link to="/help" onMouseEnter={customOnMouseEnter} prefetch="hover">
        Help
      </Link>
    </TestWrapper>,
  );

  const link = screen.getByText("Help");
  fireEvent.mouseEnter(link);

  expect(customOnMouseEnter).toHaveBeenCalled();
  expect(mockLoad).toHaveBeenCalledWith("/help");
});

test("Link with eager prefetch loads on mount", () => {
  render(
    <TestWrapper>
      <Link to="/admin" prefetch="eager">
        Admin
      </Link>
    </TestWrapper>,
  );

  expect(mockLoad).toHaveBeenCalledWith("/admin");
});

test("Link with none prefetch does not load", () => {
  render(
    <TestWrapper>
      <Link to="/blog" prefetch="none">
        Blog
      </Link>
    </TestWrapper>,
  );

  const link = screen.getByText("Blog");
  fireEvent.mouseEnter(link);

  expect(mockLoad).not.toHaveBeenCalled();
});

test("Link with viewport prefetch sets up IntersectionObserver", () => {
  const mockObserve = vi.fn();
  const mockDisconnect = vi.fn();

  mockIntersectionObserver.mockReturnValue({
    observe: mockObserve,
    disconnect: mockDisconnect,
    unobserve: vi.fn(),
  });

  render(
    <TestWrapper>
      <Link to="/gallery" prefetch="viewport">
        Gallery
      </Link>
    </TestWrapper>,
  );

  expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
    rootMargin: "200px",
  });
});

test("Link uses default prefetch strategy from config", () => {
  render(
    <TestWrapper>
      <Link to="/docs">Docs</Link>
    </TestWrapper>,
  );

  const link = screen.getByText("Docs");
  fireEvent.mouseEnter(link);

  // Default strategy is "hover", so it should be called
  expect(mockLoad).toHaveBeenCalledWith("/docs");
});

test("Link overrides default prefetch strategy", () => {
  render(
    <TestWrapper>
      <Link to="/api" prefetch="none">
        API
      </Link>
    </TestWrapper>,
  );

  const link = screen.getByText("API");
  fireEvent.mouseEnter(link);

  // Even though default is "hover", explicit "none" should override
  expect(mockLoad).not.toHaveBeenCalledWith("/api");
});
