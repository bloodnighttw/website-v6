import { EXT_RSC } from "./constant";
import normalize, { normalizeExt } from "./normalize";

export class Matcher {
  private normalizedPath: string;
  private keys: string[];
  private regexp: RegExp;

  constructor(path: string) {
    this.normalizedPath = normalize(path);
    this.keys = Matcher.grabKeys(this.normalizedPath);
    this.regexp = Matcher.toRegExp(this.normalizedPath);
  }

  // this function should pass a normalized path
  private static toRegExp(path: string): RegExp {
    // path is normalized (starts with /, no duplicate slashes)
    // convert ":param" segments into named capture groups
    // preserve trailing slash if present

    // Replace :...param with catch-all pattern (captures remaining path)
    // Replace :param with single segment pattern
    const transformed = path
      .replace(/:\.\.\.([^/]+)/g, "(.*)")
      .replace(/:([^/]+)/g, "([^/]+)");

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

  // Check if a key is a catch-all parameter (starts with ...)
  private static isCatchAll(key: string): boolean {
    return key.startsWith("...");
  }

  // Get the clean key name without the ... prefix
  private static getCleanKey(key: string): string {
    return key.startsWith("...") ? key.slice(3) : key;
  }

  // return false if no match is found
  // otherwise return an object with the captured parameters
  // note: this function should only use in server side
  public match(path: string): Record<string, string | string[]> | false {
    const normalizedPath = normalizeExt(path) ?? normalize(path);
    const match = this.regexp.exec(normalizedPath);
    if (!match) return false;

    const params: Record<string, string | string[]> = {};
    // match.slice(1) contains capturing groups in order corresponding to this.keys
    const groups = match.slice(1);
    for (let i = 0; i < this.keys.length; i++) {
      const key = this.keys[i];
      const cleanKey = Matcher.getCleanKey(key);
      if (Matcher.isCatchAll(key)) {
        // For catch-all parameters, split the captured string by '/' to create an array
        const capturedPath = groups[i] as string;
        params[cleanKey] = capturedPath
          ? capturedPath.split("/").filter(Boolean)
          : [];
      } else {
        params[cleanKey] = groups[i] as string;
      }
    }
    return params;
  }

  public toString(params: Record<string, string | string[]>): string {
    let path = this.keys.reduce((acc, key) => {
      const cleanKey = Matcher.getCleanKey(key);
      const paramValue = params[cleanKey];
      if (paramValue === undefined)
        throw new Error(`Missing parameter: ${cleanKey}`);

      if (Matcher.isCatchAll(key)) {
        // For catch-all parameters, join array elements with '/'
        const arrayValue = Array.isArray(paramValue)
          ? paramValue
          : [paramValue];
        return acc.replace(`:${key}`, arrayValue.join("/"));
      } else {
        // For single parameters, use string value
        const stringValue = Array.isArray(paramValue)
          ? paramValue[0]
          : paramValue;
        return acc.replace(`:${key}`, stringValue);
      }
    }, this.normalizedPath);
    return path;
  }

  public noKeysUsePath(): boolean | string {
    return this.keys.length === 0 ? this.normalizedPath : false;
  }
}

export function matchParams(
  left: Record<string, string | string[]>,
  right: Record<string, string | string[]>[] | object,
): Record<string, string | string[]> | false {
  if (
    left instanceof Object &&
    Object.keys(left).length === 0 // left is {}
  ) {
    if (right instanceof Array) return right.at(0) ?? {};
    else return right as Record<string, string | string[]>;
  }
  if (!(right instanceof Array)) {
    throw new Error(
      "Object in second parameter is only allow when first parameter is empty object",
    );
  }

  l1: for (const obj of right) {
    for (const [k, v] of Object.entries(left)) {
      if (obj[k] === undefined) {
        continue l1;
      }

      // Handle array comparison for catch-all params
      if (Array.isArray(v) && Array.isArray(obj[k])) {
        if (JSON.stringify(v) !== JSON.stringify(obj[k])) {
          continue l1;
        }
      } else if (obj[k] !== v) {
        continue l1;
      }
    }
    return obj;
  }

  return false;
}

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
