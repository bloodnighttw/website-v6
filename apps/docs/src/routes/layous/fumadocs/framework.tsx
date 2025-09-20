"use client";

import { FrameworkProvider, type Router } from "fumadocs-core/framework";
import type { ReactNode } from "react";
import "@/global.css";
import Link from "rpress/link";

export default function Provider({
  children,
  slug,
}: {
  children: ReactNode;
  slug: string[];
}) {
  return (
    <FrameworkProvider
      useParams={() => ({})}
      usePathname={() => "/" + slug.join("/")}
      useRouter={() => ({}) as Router}
      Link={(props) => <Link to={props.href!}>{props.children}</Link>}
    >
      {children}
    </FrameworkProvider>
  );
}
