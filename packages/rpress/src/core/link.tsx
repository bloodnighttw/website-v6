"use client";

import config from "virtual:rpress:config/json";
import load from "./rsc-loader";
import { useEffect } from "react";

console.log("link config", config);

if (import.meta.hot) {
  import.meta.hot.accept();
}

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
      const el = document.querySelector(`a[href='${to}']`);
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
    >
      {children}
    </a>
  );
}
