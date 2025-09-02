import { Matcher, type InferPathParams } from "../utils/path/matcher";

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
  matcher: Matcher;
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
  const matcher = new Matcher(path);

  config ??= {
    generator: async () => {
      return [];
    },
  };

  return {
    matcher,
    config,
  };
}

export type RouteParams<R extends Route<string>> =
  R extends Route<infer T> ? InferPathParams<T> : never;

export interface RouterProps<R extends Route<string>> {
  params: RouteParams<R>;
}
