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

    const transformed = path.replace(
      /:([A-Za-z0-9_-]+)/g,
      (_m, name) => `(?<${name}>[^/]+)`,
    );

    // Anchor start and end
    return new RegExp(`^${transformed}$`);
  }

  // This function should return an array of keys
  private static grabKeys(path: string): string[] {
    const keys: string[] = [];
    const regex = /:([A-Za-z0-9_-]+)/g;
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
    for (const key of this.keys) {
      params[key] = match.groups![key];
    }
    return params;
  }

}

export function isRscRequest(request: Request) {
  return request.url.endsWith(`${RSC_POSTFIX}`) && !request.url.endsWith(`/${RSC_POSTFIX}`);
}