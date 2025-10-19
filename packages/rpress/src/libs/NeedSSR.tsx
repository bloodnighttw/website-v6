"use client";

import { use } from "react";
import { underSSR } from "./nossr";
import ShouldThrowError from "./utils/shouldThrowError";

export class NeedSSRError extends ShouldThrowError {
  constructor(message?: string) {
    super(
      message ?? "You need to be under SSR environment to use this component",
    );
  }
}

export default function NeedSSR({ message }: { message?: string }) {
  const isUnderSSR = use(underSSR);
  if (!isUnderSSR) {
    throw new NeedSSRError(message);
  }
  return null;
}
