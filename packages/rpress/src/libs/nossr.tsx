"use client";

import { Suspense } from "react";
import ShouldCaughtError from "./utils/shouldCaughtError";
import isClient from "virtual:rpress:client-env";

class NoSSRError extends ShouldCaughtError {
  constructor() {
    super("NoSSR");
  }
}

function ThrowNoSSR(): null {
  throw new NoSSRError();
}

export default function NoSSR({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback}>
      {isClient ? children : <ThrowNoSSR />}
    </Suspense>
  );
}
