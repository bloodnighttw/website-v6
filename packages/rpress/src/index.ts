import defineConfig, { type RPressConfig } from "./core/defineConfig";
import { createRoute } from "./core/route";
import { type RouterProps } from "./core/route";
import type { InferPathParams } from "./utils/path/matcher";

export { createRoute, defineConfig };
export type { InferPathParams, RouterProps, RPressConfig };
