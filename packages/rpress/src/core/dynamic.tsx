import { lazy, Suspense } from "react";
import ShouldCaughtError from "../utils/shouldCaughtError";

export class NoSSR extends ShouldCaughtError {
  constructor() {
    super("NoSSR");
  }
}

function PreventRendring(): null {
  throw new NoSSR();
}

interface DynamicOptions {
  // default to true
  ssr: boolean;
  loading: React.ReactNode;
}

export default function dynamic(
  importPromise: () => Promise<{ default: React.ComponentType<any> }>,
  options?: Partial<DynamicOptions>,
) {
  const { ssr = true, loading = null } = options || {};

  const LazyComponent = lazy(importPromise);

  return function (prop: React.ComponentProps<typeof LazyComponent>) {
    const isServer = typeof window === "undefined";

    return (
      <Suspense fallback={loading}>
        {isServer && !ssr ? <PreventRendring /> : null}
        <LazyComponent {...prop} />
      </Suspense>
    );
  };
}
