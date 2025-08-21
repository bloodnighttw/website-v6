import { endWithRscPostfix, endWithHtmlPostfix, RSC_POSTFIX } from '.';


export function normalize(path: string): string {

  if (endWithRscPostfix.test(path)) {
    path = path.replace(endWithRscPostfix, '');
  } else if (endWithHtmlPostfix.test(path)) {
    path = path.replace(endWithHtmlPostfix, '');
  }
  // remove leading and trailing slashes
  const spiltted = path.split('/').filter((p) => p !== '');

  if (spiltted.length === 0) {
    return 'index';
  }

  return spiltted.join('/');
}

export function normalizeByRequest(request: Request): string {
  const url = new URL(request.url);
  return normalize(url.pathname);
}

export function isRscRequest(request: Request) {
  const url = new URL(request.url);
  return url.pathname.endsWith(RSC_POSTFIX);
}
