/**
 * Custom Path-to-RegExp Solution in TypeScript
 * Handles patterns like /:id/a and /:lang/:id where parameters are extracted
 */

interface MatchResult {
  path: string;
  params: Record<string, string>;
}

class PathMatcher <T extends string> {
  public readonly pattern: T;
  // we store it as internal keys to know which parameters to extract
  public readonly keys: string[];
  public readonly regexp: RegExp;

  constructor(pattern: T) {
    this.pattern = pattern;
    this.keys = [];
    this.regexp = this.toRegExp(pattern);
  }

  /**
   * Convert a path pattern to a regular expression
   * @param path - Path pattern like "/:id/a" or "/:lang/:id"
   * @returns Regular expression to match the path
   */
  private toRegExp(path: string): RegExp {
    // Reset keys array
    this.keys.length = 0;
    
    // Escape special regex characters except for our parameter syntax
    let regexPattern = path.replace(/[.+*?^${}()|[\]\\]/g, '\\$&');
    
    // Replace parameter patterns like :id with capture groups
    regexPattern = regexPattern.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (_match: string, paramName: string) => {
      this.keys.push(paramName);
      return '([^/]+)'; // Match any character except forward slash
    });
    
    // Ensure exact match by anchoring start and end
    return new RegExp(`^${regexPattern}$`);
  }

  /**
   * Test if a path matches the pattern
   * @param path - Path to test
   * @returns True if path matches
   */
  public test(path: string): boolean {
    return this.regexp.test(path);
  }

  /**
   * Execute the regex against a path and return match results
   * @param path - Path to match
   * @returns Match object with params or null if no match
   */
  public exec(path: string): MatchResult | null {
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
}

/**
 * Factory function to create a path matcher
 * @param pattern - Path pattern with named parameters
 * @returns PathMatcher instance
 */
function path2RegExp<T extends string>(pattern: T): PathMatcher<T> {
  return new PathMatcher(pattern);
}

/**
 * Type utility to extract parameter names from a path pattern
 */
type ExtractParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param]: string } & ExtractParams<`/${Rest}`>
    : T extends `${string}:${infer Param}`
    ? { [K in Param]: string }
    : {};

/**
 * Type utility to infer parameter types from path pattern
 */
type InferPathParams<T extends string> = {
    [K in keyof ExtractParams<T>]: ExtractParams<T>[K];
};

// Type-safe matchers
// Export for use in modules
export { path2RegExp, PathMatcher };
export type { MatchResult, InferPathParams };