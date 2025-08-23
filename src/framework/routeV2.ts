import {
  path2RegExp,
  PathMatcher,
  type InferPathParams,
} from "./utils/path2regexp";

interface RouteConfig<T extends string> {
  generator: () => Promise<Array<InferPathParams<T>>>;
}

export interface RouteModule {
  default: React.ComponentType<{ params: InferPathParams<string> }>;
  config: Route<string>;
}

interface Route<T extends string> {
  matcher: PathMatcher<T>;
  config: RouteConfig<T>;
}

export function createRoute<T extends string>(
  path: T,
  config: RouteConfig<T>,
): Route<T> {
  const pathMatcher = path2RegExp(path);

  return {
    matcher: pathMatcher,
    config,
  };
}

export type RouteParams<R extends Route<string>> =
  R extends Route<infer T> ? InferPathParams<T> : never;

export interface RouterProps<R extends Route<string>> {
  params: RouteParams<R>;
}
