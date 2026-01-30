"use client";
import { useEffect } from "react";

function DevStyleXInjectImpl() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      import("virtual:stylex:runtime");
    }
  }, []);
  return <link rel="stylesheet" href="/virtual:stylex.css" />;
}

export function DevStyleXInject({ cssHref }: { cssHref: string }) {
  return import.meta.env.DEV ? (
    <DevStyleXInjectImpl />
  ) : (
    cssHref && <link rel="stylesheet" href={cssHref} />
  );
}
