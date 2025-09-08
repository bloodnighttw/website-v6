// a un-normalized path => normalize() => a normalized path
// a normalized path => normalized2html() => a normalized HTML path
// a normalized path => normalized2rsc() => a normalized RSC path
// a normalized HTML path => normalizeExt() => a normalized path
// a normalized RSC path => normalizeExt() => a normalized path
// otherwise undefined behavior
// note the url pathname is our normalized path

import { EXT_HTML, EXT_RSC, INDEX } from "./constant";

export default function normalize(pathname: string) {
  if (pathname.at(0) !== "/") pathname = "/" + pathname;

  // collapse multiple slashes
  pathname = pathname.replace(/\/+/g, "/");

  return pathname;
}

// return undefined if the extension is not supported
export function normalizeExt(pathname: string) {
  if (pathname.at(0) !== "/")
    throw new Error(
      "The input of normalizeExt should be a normalized path starting with / since we assume that the url has already been normalized",
    );

  const paths = pathname.split("/").slice(1);
  const last = paths.pop();

  // check if paths has empty strings
  if (paths.slice(0, -1).some((p) => p === "")) {
    throw new Error(
      "Invalid path, don't use // in the path with extensions, we assume that the url has already been normalized",
    );
  }

  if (last === `${INDEX}${EXT_HTML}`) {
    return normalize(`/${paths.join("/")}/`);
  }

  if (last === `${INDEX}${EXT_RSC}`) {
    return normalize(`/${paths.join("/")}/`);
  }

  if (last?.endsWith(EXT_RSC)) {
    if (last.replace(EXT_RSC, "") === "")
      throw new Error("Invalid path, missing RSC file name");
    return normalize(`/${paths.join("/")}/${last.replace(EXT_RSC, "")}`);
  }

  if (last?.endsWith(EXT_HTML)) {
    if (last.replace(EXT_HTML, "") === "")
      throw new Error("Invalid path, missing HTML file name");
    return normalize(`/${paths.join("/")}/${last.replace(EXT_HTML, "")}`);
  }

  return undefined;
}

export function normalized2html(normalized: string) {
  // this function converts a normalized path to html path.
  // the input should be a normalized path string.
  // output will be the path to generate the corresponding HTML file.
  //
  // For example:
  // Input: "/hello/world"
  // Output: "/hello/world.html"
  //
  // Input: "/"
  // Output: "/index.html"
  //
  // Input: "/hi"
  // Output: "/hi.html"
  //
  // Input: "/hi/there/"
  // Output: "/hi/there/index.html"

  return normalized.endsWith("/")
    ? `${normalized}${INDEX}${EXT_HTML}`
    : `${normalized}${EXT_HTML}`;
}

export function normalized2rsc(normalized: string) {
  // this function converts a normalized path to RSC path.
  // the input should be a normalized path string.
  // output will be the path to generate the corresponding RSC file.
  //
  // For example:
  // Input: "/hello/world"
  // Output: "/hello/world.rsc"
  //
  // Input: "/"
  // Output: "/index.rsc"
  //
  // Input: "/hi"
  // Output: "/hi.rsc"
  //
  // Input: "/hi/there/"
  // Output: "/hi/there/index.rsc"

  return normalized.endsWith("/")
    ? `${normalized}${INDEX}${EXT_RSC}`
    : `${normalized}${EXT_RSC}`;
}
