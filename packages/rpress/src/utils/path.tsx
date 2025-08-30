// this module is used by frontend, backend, ssg, so don't put any server/client specific code here

import { HTML_POSTFIX, RSC_POSTFIX } from "../config";

export const endWithRscPostfix = new RegExp(`${RSC_POSTFIX}$`);
export const endWithHtmlPostfix = new RegExp(`${HTML_POSTFIX}$`);

export function normalize(path: string): string {
  if (path === "") return "/index";

  // remove .html and .rsc postfix
  path = path.replace(endWithHtmlPostfix, "").replace(endWithRscPostfix, "");

  if (path.endsWith("/")) {
    return path + "index";
  }
  return path;
}

export function normalizeByRequest(request: Request): string {
  const url = new URL(request.url);
  return normalize(url.pathname);
}

export function isRscRequest(request: Request) {
  const url = new URL(request.url);
  return url.pathname.endsWith(RSC_POSTFIX);
}
