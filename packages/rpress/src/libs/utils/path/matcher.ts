import { EXT_RSC } from "./constant";

export class Matcher {}

export function isRSCRequest(request: Request) {
  const url = new URL(request.url);
  return url.pathname.endsWith(EXT_RSC);
}

// a type to infer the parameters from the path
// for example, given the path "/users/:id/", it will produce { id: string }
// or given "/posts/:postId/comments/:commentId" -> { postId: string, commentId: string }
// but when giving ":id/wtf", it shouldn't produce any parameters

// Trim leading/trailing slashes from a path fragment
type TrimSlashes<S extends string> = S extends `/${infer Rest}`
  ? TrimSlashes<Rest>
  : S extends `${infer Rest}/`
    ? TrimSlashes<Rest>
    : S;

// Extract params from segments, handling both :name and :...name
type ParamsFromSegment<S extends string> = S extends `:...${infer Name}`
  ? Name extends ""
    ? {}
    : { [K in Name]: string[] }
  : S extends `:${infer Name}`
    ? Name extends ""
      ? {}
      : { [K in Name]: string }
    : {};

// Recursively walk segments separated by "/"
type ExtractParamsFromSegments<S extends string> =
  S extends `${infer Head}/${infer Tail}`
    ? ParamsFromSegment<Head> & ExtractParamsFromSegments<Tail>
    : ParamsFromSegment<S>;

// Public type: only parse when the original path starts with a leading "/"
type ParamsFromPath<Path extends string> = ExtractParamsFromSegments<
  TrimSlashes<Path>
>;

type DirtyChecker = {
  _________________________it_is_so_dirty________________________: any;
};

type FlatUnion<T> = {
  [K in keyof T]: T[K] extends object ? FlatUnion<T[K]> : T[K];
};

type EmptyToUndefined<T> =
  DirtyChecker extends FlatUnion<T & DirtyChecker> ? undefined : FlatUnion<T>;

export type InferPathParams<T extends string> = EmptyToUndefined<
  ParamsFromPath<T>
>;
