"use client";

import fetchrsc from "../utils/prefetch-rsc";
import config from "virtual:rpress:config/json";

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

  return (
    <a
      href={to}
      onMouseEnter={(e) => {
        if (prefetch === "hover") {
          console.log("prefetch", prefetch);
          fetchrsc.preload(to);
        }
        onMouseEnter?.(e);
      }}
      onClick={(e) => {
        e.preventDefault();
        window.history.pushState({}, "", to);
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
