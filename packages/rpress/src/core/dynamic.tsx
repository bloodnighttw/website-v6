import { lazy, Suspense } from "react";
import ShouldCaughtError from "../utils/shouldCaughtError";

class NoSSR extends ShouldCaughtError {
  constructor() {
    super("NoSSR");
  }
}

function DisableSSR(): null {
  if(typeof window !== "undefined") return null;
  throw new NoSSR();
}

interface DynamicOptions {
  // default to true
  ssr: boolean;
  loading: React.ReactNode;
}

export default function noSSR(
  importPromise: () => Promise<{ default: React.ComponentType<any> }>,
  options?: Partial<DynamicOptions>,
) {
  const { ssr = true, loading = null } = options || {};

  const LazyComponent = lazy(importPromise);

  return function (prop: React.ComponentProps<typeof LazyComponent>) {
    return (
      <Suspense fallback={loading}>
        {(typeof window === "undefined" && !ssr) && <DisableSSR/>}
        <LazyComponent {...prop} />
      </Suspense>
    );
  };
}
