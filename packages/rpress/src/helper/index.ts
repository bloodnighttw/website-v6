import { lazy } from "react";
import { FlatComponentHelper } from "./flat-component-helper";

// to prevent hydration errors when import this module
const ErrorBoundary = lazy(() => import("./error"));

export { FlatComponentHelper, ErrorBoundary };
