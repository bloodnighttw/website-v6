"use client";

import config from "virtual:rpress:config/json";
import load from "virtual:rpress:rsc-loader";
import { useEffect, useRef } from "react";

interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  prefetch?: "hover" | "viewport" | "none";
}

export default function Link(props: LinkProps) {
  const {
    to,
    children,
    onMouseEnter,
    onClick,
    prefetch = config.prefetchStrategy,
    ...rest
  } = props;

  const anchorRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
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
      const el = anchorRef.current;
      if (el) {
        io.observe(el);
      }
      return () => {
        io.disconnect();
      };
    }

    if (prefetch === "eager") {
      load(to);
    }
  }, [prefetch, to]);

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
        window.history.pushState({}, "", to);
        onClick?.(e);
      }}
      ref={anchorRef}
    >
      {children}
    </a>
  );
}
