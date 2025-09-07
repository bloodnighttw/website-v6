"use client";

import config from "virtual:rpress:config/json";
import load from "./rsc-loader";

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

  return (
    <a
      href={to}
      onMouseEnter={(e) => {
        if (prefetch === "hover") {
          console.log("[rpress] prefetch", to);
          load(to);
          // preload(normalized2rsc(normalize(to)), { as: "fetch" });
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
