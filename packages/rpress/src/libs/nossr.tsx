"use client";

import { createContext, Suspense } from "react";
import ShouldCaughtError from "./utils/shouldCaughtError";
import IS_CLIENT from "virtual:rpress:client-env";

class NoSSRError extends ShouldCaughtError {
  constructor() {
    super("NoSSR");
  }
}

function ThrowNoSSR(): null {
  throw new NoSSRError();
}

export const underSSR = createContext(true);

export default function NoSSR({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <Suspense fallback={fallback}>
      <underSSR.Provider value={false}>{children}</underSSR.Provider>
      {!IS_CLIENT && <ThrowNoSSR />}
    </Suspense>
  );
}
