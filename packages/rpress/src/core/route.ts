import {
  path2RegExp,
  PathMatcher,
  type InferPathParams,
} from "../utils/path2regexp";

interface RouteConfig<T extends string> {
  generator: () => Promise<Array<InferPathParams<T>>>;
}

export interface RouteModule {
  // the params should be inferred from the route path with `InferPathParams`, due to we can't
  // infer type in lib, we use `Record<string, string>` as a fallback
  default: React.ComponentType<{ params: Record<string, string> }>;
  route: Route<string>;
}

interface Route<T extends string> {
  matcher: PathMatcher<T>;
  config: RouteConfig<T>;
}

export function createRoute<T extends string>(
  path: T,
  ...rest: InferPathParams<T> extends void ? [] : [config: RouteConfig<T>]
): Route<T>;

export function createRoute<T extends string>(
  path: T,
  config?: RouteConfig<T> | undefined,
): Route<T> {
  const pathMatcher = path2RegExp(path);

  if (pathMatcher.hasParams() === false) {
    if (config) {
      console.warn("Route config is ignored for static routes");
    }
    config = {
      generator: async () => {
        return [];
      },
    } as RouteConfig<T>;
  } else {
    if (!config)
      throw new Error("Dynamic route must have a config with generator since we don't support SSR currently");
  }

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
