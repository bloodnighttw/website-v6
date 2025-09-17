"use client";

import config from "virtual:rpress:config";
import load from "virtual:rpress:rsc-loader";
import { useEffect } from "react";
import useNavigate from "./route/navigate";

interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
  prefetch?: "hover" | "viewport" | "none" | "eager";
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

  useEffect(() => {
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
