"use client";

import config from "virtual:rpress:config";
import load from "virtual:rpress:rsc-loader";
import { useEffect } from "react";
import useNavigate from "@/libs/route/navigate";

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  prefetch?: "hover" | "viewport" | "none" | "eager";
}

function isExternalUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url, window.location.href);
    return parsedUrl.origin !== window.location.origin;
  } catch {
    return false;
  }
}

export default function Link(props: LinkProps) {
  const navi = useNavigate();

  const {
    to,
    children,
    onMouseEnter,
    onClick,
    prefetch = config.prefetchStrategy,
    ...rest
  } = props;

  const isExternal = isExternalUrl(to);

  useEffect(() => {
    if (!isExternal && prefetch === "eager") {
      load(to);
    }
  }, [isExternal, prefetch, to]);

  if (isExternal) {
    return (
      <a {...rest} href={to} onClick={onClick} onMouseEnter={onMouseEnter}>
        {children}
      </a>
    );
  }

  return (
    <a
      {...rest}
      href={to}
      onMouseEnter={(e) => {
        if (prefetch === "hover") {
          load(to);
        }
        onMouseEnter?.(e);
      }}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
        navi(to);
      }}
      ref={(ref) => {
        if (prefetch === "viewport") {
          const io = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  load(to);
                  io.disconnect();
                }
              });
            },
            {
              rootMargin: "200px",
            },
          );
          if (ref) {
            io.observe(ref);
          }
          return () => {
            io.disconnect();
          };
        }
      }}
    >
      {children}
    </a>
  );
}
