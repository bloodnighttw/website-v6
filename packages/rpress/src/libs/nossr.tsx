"use client";

import { createContext, Suspense, use } from "react";
import ShouldCaughtError from "./utils/shouldCaughtError";
import isClient from "virtual:rpress:client-env";
import ShouldThrowError from "./utils/shouldThrowError";

class NoSSRError extends ShouldCaughtError {
  constructor() {
    super("NoSSR");
  }
}

class NeedSSRError extends ShouldThrowError {
  constructor(message?: string) {
    super(
      message ?? "You need to be under SSR environment to use this component",
    );
  }
}

function ThrowNoSSR(): null {
  throw new NoSSRError();
}

const underSSR = createContext(true);

export default function NoSSR({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <underSSR.Provider value={false}>
      <Suspense fallback={fallback}>
        {isClient ? children : <ThrowNoSSR />}
      </Suspense>
    </underSSR.Provider>
  );
}

export function NeedSSR({ message }: { message?: string }) {
  const isUnderSSR = use(underSSR);
  if (!isUnderSSR) {
    throw new NeedSSRError(message);
  }
}
