import * as stylex from "@stylexjs/stylex";

export const breakpoints = stylex.defineConsts({
  small: "@media (max-width: 600px)",
  medium: "@media (min-width: 601px) and (max-width: 1024px)",
  large: "@media (min-width: 1025px)",
});

export const zIndices = stylex.defineConsts({
  modal: "1000",
  tooltip: "1100",
  toast: "1200",
});

export const animations = stylex.defineConsts({
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  fast: "150ms",
});
