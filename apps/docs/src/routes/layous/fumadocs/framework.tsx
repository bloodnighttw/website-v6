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
      // @ts-expect-error
      Link={({ href, ...rest }) => (
        <Link to={href!} className={className} {...rest}>
          {children}
        </Link>
      )}
    >
      {children}
    </FrameworkProvider>
  );
}
