"use client";

import { FrameworkProvider, type Router } from "fumadocs-core/framework";
import type { ReactNode } from "react";
import Link from "rpress/link";

export default function Provider({
  children,
  slug,
  params,
}: {
  children: ReactNode;
  slug: string[];
  params?: Record<string, string>;
}) {
  return (
    <FrameworkProvider
      useParams={() => params || {}}
      usePathname={() => "/" + slug.join("/")}
      useRouter={() => ({}) as Router}
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
