import { RSC_POSTFIX } from "../../config";
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
  public match(path: string): Record<string, string> | false {
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

export function matchParams(
  left: Record<string, string>,
  right: Record<string, string>[] | object,
): Record<string, string> | false {
  if (
    left instanceof Object &&
    Object.keys(left).length === 0 // left is {}
  ) {
    if (right instanceof Array) return right.at(0) ?? {};
    else return right as Record<string, string>;
  }
  if (!(right instanceof Array)) {
    throw new Error(
      "Object in second parameter is only allow when first parameter is empty object",
    );
  }

  l1: for (const obj of right) {
    for (const [k, v] of Object.entries(left)) {
      if (obj[k] === undefined || obj[k] !== v) {
        continue l1;
      }
    }
    return obj;
  }

  return false;
}

export function isRSCRequest(request: Request) {
  const url = new URL(request.url);
  return url.pathname.endsWith(RSC_POSTFIX);
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
