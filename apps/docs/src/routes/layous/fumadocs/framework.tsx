"use client";

import { FrameworkProvider, type Router } from "fumadocs-core/framework";
import type { ReactNode } from "react";
import Link from "rpress/link";

export default function Provider({
  children,
  pathname,
  params,
}: {
  children: ReactNode;
  params?: Record<string, string>;
  pathname?: string;
}) {
  return (
    <FrameworkProvider
      useParams={() => params || {}}
      usePathname={() => pathname || "/"}
      useRouter={() => ({}) as Router}
      // @ts-ignore
      Link={({ href, children: c, prefetch, ...rest }) => (
        <Link to={href!} prefetch={prefetch ? undefined : "none"} {...rest}>
          {c}
        </Link>
      )}
    >
      {children}
    </FrameworkProvider>
  );
}
