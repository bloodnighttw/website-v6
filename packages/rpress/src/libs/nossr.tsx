"use client";

import { createContext, Suspense, useContext } from "react";
import ShouldCaughtError from "./utils/shouldCaughtError";
import IS_CLIENT from "virtual:rpress:client-env";
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
    <Suspense fallback={fallback}>
      {IS_CLIENT ? (
        <underSSR.Provider value={false}>{children}</underSSR.Provider>
      ) : (
        <ThrowNoSSR />
      )}
    </Suspense>
  );
}

export function NeedSSR({ message }: { message?: string }) {
  const isUnderSSR = useContext(underSSR);
  if (!isUnderSSR) {
    throw new NeedSSRError(message);
  }
  return null;
}
