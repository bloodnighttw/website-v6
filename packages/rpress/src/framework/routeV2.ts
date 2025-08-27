import {
  path2RegExp,
  PathMatcher,
  type InferPathParams,
} from "./utils/path2regexp";


export interface RouteModule {
  default: React.ComponentType<{}>;
}

interface Route<T extends string> {
  matcher: PathMatcher<T>;
}

export function createRoute<T extends string>(
  path: T,
): Route<T> {
  const pathMatcher = path2RegExp(path);

  return {
    matcher: pathMatcher,
  };
}

// yeah a small utilty to convert /:id/:wtf to interface {id: string, wtf: string}
export type RouteParams<R extends Route<string>> =
  R extends Route<infer T> ? InferPathParams<T> : never;

