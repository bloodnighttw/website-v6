import { Suspense, use } from "react";

function Await({ fn }: { fn: Promise<{ default: React.ComponentType<any> }> }) {
  const C = use(fn).default;
  return <C />;
}

export default function noSSR<T extends {}, C extends React.ComponentType<T>>(
  importPromise: () => Promise<{ default: C }>,
) {
  return function () {
    return (
      <Suspense fallback={<div>loading...</div>}>
        <Await fn={importPromise()} />
      </Suspense>
    );
  };
}
