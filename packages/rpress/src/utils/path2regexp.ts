// this module is only used by backend, so don't put any client specific code here

interface MatchResult {
  path: string;
  params: Record<string, string>;
}

class PathMatcher<T extends string> {
  public readonly pattern: T;
  // we store it as internal keys to know which parameters to extract
  public readonly keys: string[];
  public readonly regexp: RegExp;

  constructor(pattern: T) {
    this.pattern = pattern;
    this.keys = [];
    this.regexp = this.toRegExp(pattern);
  }

  private toRegExp(path: string): RegExp {
    // Reset keys array
    this.keys.length = 0;

    // Escape special regex characters except for our parameter syntax
    let regexPattern = path.replace(/[.+*?^${}()|[\]\\]/g, "\\$&");

    // Replace parameter patterns like :id with capture groups
    regexPattern = regexPattern.replace(
      /:([a-zA-Z_][a-zA-Z0-9_]*)/g,
      (_match: string, paramName: string) => {
        this.keys.push(paramName);
        return "([^/]+)"; // Match any character except forward slash
      },
    );

    // Ensure exact match by anchoring start and end
    return new RegExp(`^${regexPattern}$`);
  }

  // test if a path matches the pattern
  public test(path: string): boolean {
    if(path === "") throw new Error("Path must be normalized");
    return this.regexp.test(path);
  }

  // to get match results
  public exec(path: string): MatchResult | null {
    if(path === "") throw new Error("Path must be normalized");
    const match = this.regexp.exec(path);

    if (!match) {
      return null;
    }

    // Create params object from captured groups
    const params: Record<string, string> = {};
    this.keys.forEach((key, index) => {
      params[key] = match[index + 1]; // index + 1 because match[0] is the full match
    });

    return {
      path: match[0],
      params,
    };
  }

  // Convert back to a path string by replacing parameters with values
  public toString(params: InferPathParams<T>): string {
    let result = this.pattern as string;

    // Replace each parameter with its value
    this.keys.forEach((key) => {
      const value = (params as Record<string, string>)[key];
      if (value !== undefined) {
        result = result.replace(`:${key}`, String(value));
      }
    });

    return result;
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
type InferPathParams<T extends string> = ExtractParams<T> extends void ? void :{
  [K in keyof ExtractParams<T>]: ExtractParams<T>[K];
};

// Type-safe matchers
// Export for use in modules
export { path2RegExp, PathMatcher };
export type { MatchResult, InferPathParams };
