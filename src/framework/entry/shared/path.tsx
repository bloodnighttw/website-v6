import { HTML_POSTFIX, RSC_POSTFIX } from '.';

export const endWithRscPostfix = new RegExp(`${RSC_POSTFIX}$`)
export const endWithHtmlPostfix = new RegExp(`${HTML_POSTFIX}$`)

export function normalize(path: string): string {
  if(path.endsWith('/') || path === "") {
    return path + "index"
  }
  return path
}

export function normalizeByRequest(request: Request): string {
  const url = new URL(request.url);
  return normalize(url.pathname);
}

export function isRscRequest(request: Request) {
  const url = new URL(request.url);
  return url.pathname.endsWith(RSC_POSTFIX);
}
