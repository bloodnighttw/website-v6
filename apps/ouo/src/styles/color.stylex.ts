import * as stylex from "@stylexjs/stylex";

const zinc = {
  50: "#fafafa",
  100: "#f4f4f5",
  200: "#e4e4e7",
  300: "#d4d4d8",
  400: "#a1a1aa",
  500: "#71717a",
  600: "#52525b",
  700: "#3f3f46",
  800: "#27272a",
  900: "#18181b",
  950: "#09090b",
};

const stone = {
  50: "#fafaf9",
  100: "#f5f5f4",
  200: "#e7e5e4",
  300: "#d6d3d1",
  400: "#a8a29e",
  500: "#78716c",
  600: "#57534e",
  700: "#44403c",
  800: "#292524",
  900: "#1c1917",
  950: "#0c0a09",
};

const red = {
  50: "#fef2f2",
  100: "#fee2e2",
  200: "#fecaca",
  300: "#fca5a5",
  400: "#f87171",
  500: "#ef4444",
  600: "#dc2626",
  700: "#b91c1c",
  800: "#991b1b",
  900: "#7f1d1d",
  950: "#450a0a",
};

const yellow = {
  50: "#fefce8",
  100: "#fef9c3",
  200: "#fef08a",
  300: "#fde047",
  400: "#facc15",
  500: "#eab308",
  600: "#ca8a04",
  700: "#a16207",
  800: "#854d0e",
  900: "#713f12",
  950: "#422006",
};

function withOpacity(color: string, opacity: number): string {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

export const colors = stylex.defineVars({
  // Primary (Zinc)
  primary50: zinc[50],
  primary100: zinc[100],
  primary200: zinc[200],
  primary300: zinc[300],
  primary400: zinc[400],
  primary500: zinc[500],
  primary600: zinc[600],
  primary700: zinc[700],
  primary800: zinc[800],
  primary900: zinc[900],
  primary950: zinc[950],

  // Primary with opacity
  primary500_5: withOpacity(zinc[500], 5),
  primary500_10: withOpacity(zinc[500], 10),
  primary500_20: withOpacity(zinc[500], 20),
  primary500_30: withOpacity(zinc[500], 30),

  // Secondary (Stone)
  secondary50: stone[50],
  secondary100: stone[100],
  secondary200: stone[200],
  secondary300: stone[300],
  secondary400: stone[400],
  secondary500: stone[500],
  secondary600: stone[600],
  secondary700: stone[700],
  secondary800: stone[800],
  secondary900: stone[900],
  secondary950: stone[950],

  // Secondary with opacity
  secondary500_5: withOpacity(stone[500], 5),
  secondary500_10: withOpacity(stone[500], 10),

  // Accent (Red)
  accent50: red[50],
  accent100: red[100],
  accent200: red[200],
  accent300: red[300],
  accent400: red[400],
  accent500: red[500],
  accent600: red[600],
  accent700: red[700],
  accent800: red[800],
  accent900: red[900],
  accent950: red[950],

  // Warning (Yellow)
  warning50: yellow[50],
  warning100: yellow[100],
  warning200: yellow[200],
  warning300: yellow[300],
  warning400: yellow[400],
  warning500: yellow[500],
  warning600: yellow[600],
  warning700: yellow[700],
  warning800: yellow[800],
  warning900: yellow[900],
  warning950: yellow[950],

  // Warning with opacity
  warning500_10: withOpacity(yellow[500], 10),
  warning500_30: withOpacity(yellow[500], 30),

  // Base
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
});
