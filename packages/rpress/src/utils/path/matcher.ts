import normalize, { normalizeExt } from "./normalize";

export class Matcher {
  private keys: string[];
  private regexp: RegExp;

  constructor(path: string) {
    const normalizedPath = normalize(path);
    this.keys = Matcher.grabKeys(normalizedPath);
    this.regexp = Matcher.toRegExp(normalizedPath);
  }

  // this function should pass a normalized path
  private static toRegExp(path: string): RegExp {
    // path is normalized (starts with /, no duplicate slashes)
    // convert ":param" segments into named capture groups
    // preserve trailing slash if present

    // Replace :param with plain capturing groups. Order of keys is captured separately.
    const transformed = path.replace(/:([^/]+)/g, "([^/]+)");

    // Anchor start and end
    return new RegExp(`^${transformed}$`);
  }

  // This function should return an array of keys
  private static grabKeys(path: string): string[] {
    const keys: string[] = [];
    const regex = /:([^/]+)/g;
    let match;
    while ((match = regex.exec(path))) {
      keys.push(match[1]);
    }
    return keys;
  }

  // return false if no match is found
  // otherwise return an object with the captured parameters
  // note: this function should only use in server side
  public match(path: string) {
    const normalizedPath = normalizeExt(path) ?? normalize(path);
    const match = this.regexp.exec(normalizedPath);
    if (!match) return false;

    const params: Record<string, string> = {};
    // match.slice(1) contains capturing groups in order corresponding to this.keys
    const groups = match.slice(1);
    for (let i = 0; i < this.keys.length; i++) {
      params[this.keys[i]] = groups[i] as string;
    }
    return params;
  }
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

// Extract params only from segments that are exactly ":name"
type ParamsFromSegment<S extends string> = S extends `:${infer Name}`
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
type ParamsFromPath<Path extends string> = ExtractParamsFromSegments<TrimSlashes<Path>>

type DirtyChecker = {
  _________________________it_is_so_dirty________________________: any;
};

type FlatUnion<T> = {
  [K in keyof T]: T[K] extends object ? FlatUnion<T[K]> : T[K];
};

type EmptyToUndefined<T> =
  DirtyChecker extends FlatUnion<T & DirtyChecker> ? undefined : FlatUnion<T>;

export type InferPathParams<T extends string> = EmptyToUndefined<ParamsFromPath<T>>;
