// the utilities that use by both client and server

import type React from "react";

export const RSC_POSTFIX = ".rsc";
export const HTML_POSTFIX = ".html";

export type RscPayload = {
  root: React.ReactNode;
};
