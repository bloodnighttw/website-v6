import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
  primary50: "#fafafa",
  primary100: "#f4f4f5",
  primary200: "#e4e4e7",
  primary300: "#d4d4d8",
  primary400: "#a1a1aa",
  primary500: "#71717a",
  primary600: "#52525b",
  primary700: "#3f3f46",
  primary800: "#27272a",
  primary900: "#18181b",
  primary950: "#09090b",

  secondary50: "#fafaf9",
  secondary100: "#f5f5f4",
  secondary200: "#e7e5e4",
  secondary300: "#d6d3d1",
  secondary400: "#a8a29e",
  secondary500: "#78716c",
  secondary600: "#57534e",
  secondary700: "#44403c",
  secondary800: "#292524",
  secondary900: "#1c1917",
  secondary950: "#0c0a09",

  accent50: "#fef2f2",
  accent100: "#fee2e2",
  accent200: "#fecaca",
  accent300: "#fca5a5",
  accent400: "#f87171",
  accent500: "#ef4444",
  accent600: "#dc2626",
  accent700: "#b91c1c",
  accent800: "#991b1b",
  accent900: "#7f1d1d",
  accent950: "#450a0a",
});

export const spacing = stylex.defineVars({
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "2.5rem",
  "3xl": "3rem",
  "4xl": "4rem",
});

export const fontSize = stylex.defineVars({
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
});

export const radius = stylex.defineVars({
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
});
