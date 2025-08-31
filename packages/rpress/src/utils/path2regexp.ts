// this module is only used by backend, so don't put any client specific code here

import { normalize } from "./path";

interface MatchResult {
  params: Record<string, string>;
}

class PathMatcher<T extends string> {
  public readonly pattern: T;
  // we store it as internal keys to know which parameters to extract
  public readonly keys: string[];
  public readonly regexp: RegExp;

  constructor(pattern: T) {
    this.pattern = normalize(pattern) as T;
    this.keys = [];
    this.regexp = this.toRegExp(this.pattern);
  }

  private toRegExp(path: string): RegExp {
    // Reset keys array
    this.keys.length = 0;

    // Normalize input and escape special regex characters except our param syntax
    const normalized = normalize(path);
    let regexPattern = normalized.replace(/[.+*?^${}()|[\\]\\]/g, "\\$&");

    // Replace parameter patterns like :id with named capture groups
    regexPattern = regexPattern.replace(
      /:([a-zA-Z_][a-zA-Z0-9_]*)/g,
      (_match: string, paramName: string) => {
        this.keys.push(paramName);
        return `(?<${paramName}>[^/]+)`; // Named capture group
      },
    );

    // Ensure exact match by anchoring start and end
    return new RegExp(`^${regexPattern}$`);
  }

  // path must be normalized
  private action(path: string): "test" | "match" | "not-match" {
    const normalized = normalize(path);
    if (!this.hasParams()) {
      return normalized === this.pattern ? "match" : "not-match";
    }

    return "test";
  }

  // test if a path matches the pattern
  public test(path: string): boolean {
    const normalizedPath = normalize(path);
    const act = this.action(normalizedPath);
    if (act === "not-match") return false;
    if (act === "match") return true;
    return this.regexp.test(normalizedPath);
  }

  // to get match results
  public exec(path: string): MatchResult | null {
    const normalizedPath = normalize(path);
    const act = this.action(normalizedPath);
    if (act === "not-match") return null;
    if (act === "match") return { params: {} };

    const match = this.regexp.exec(normalizedPath);

    if (!match) return null;

    // Create params object from named capture groups if available, otherwise fallback
    const params: Record<string, string> = {};
    this.keys.forEach((key, index) => {
      params[key] = match[index + 1]; // index + 1 because match[0] is the full match
    });

    return { params };
  }

  // Convert back to a path string by replacing parameters with values
  public toString(params: InferPathParams<T>) {
    return this.keys.reduce((result, key) => {
      const value = (params as Record<string, string>)[key];
      if (value == null)
        throw new Error(
          `Missing parameter \"${key}\" for pattern ${this.pattern}`,
        );
      return result.replace(`:${key}`, String(value));
    }, this.pattern as string);
  }

  public hasParams(): boolean {
    return this.keys.length > 0;
  }
}

// Factory function to create a path matcher
function path2RegExp<T extends string>(pattern: T): PathMatcher<T> {
  return new PathMatcher(pattern);
}

/**
 * Type utility to extract parameter names from a path pattern
 */
type ExtractParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param]: string } & ExtractParams<`/${Rest}`>
    : T extends `${string}:${infer Param}`
      ? { [K in Param]: string }
      : void;
/**
 * Type utility to infer parameter types from path pattern
 */
type InferPathParams<T extends string> =
  ExtractParams<T> extends void
    ? void
    : {
        [K in keyof ExtractParams<T>]: ExtractParams<T>[K];
      };

// Type-safe matchers
// Export for use in modules
export { path2RegExp, PathMatcher };
export type { MatchResult, InferPathParams };
