import { path2RegExp, PathMatcher, type InferPathParams } from "./utils/path2regexp";

interface RouteConfig<T extends string> {
  generator: () => Promise<InferPathParams<T>[] >;
}

export interface RouteModule {
  default: React.ComponentType<{ path: string }>;
  config: Route<string>;
}

interface Route<T extends string> {
  matcher: PathMatcher<T>;
  config: RouteConfig<T>;
}

export function createRoute<T extends string>(path:T, config: RouteConfig<T>): Route<T>{

  const pathMatcher = path2RegExp(path)

  return {
    matcher: pathMatcher,
    config
  }
}
