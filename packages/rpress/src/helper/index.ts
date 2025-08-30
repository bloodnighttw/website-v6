import { FlatComponentHelper } from "./flat-component-helper";

// to prevent hydration errors when import this module
const ErrorBoundary = (await import("./error")).default;

export { FlatComponentHelper, ErrorBoundary };
