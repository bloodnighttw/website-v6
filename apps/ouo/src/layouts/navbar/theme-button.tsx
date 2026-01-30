"use client";

import { toggleTheme } from "@/utils/theme";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import * as stylex from "@stylexjs/stylex";
import { colors, radius } from "@/styles/tokens.stylex";

const styles = stylex.create({
  button: {
    width: "1.5rem",
    height: "1.5rem",
    cursor: "pointer",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transitionProperty: "transform",
    transitionDuration: "200ms",
    transform: {
      ":hover": "scale(1.1)",
    },
    borderRadius: radius.md,
  },
  lightIcon: {
    color: colors.secondary50,
    position: "absolute",
    inset: 0,
    transitionProperty: "opacity, transform",
    transitionDuration: "300ms",
    opacity: {
      default: 0,
      ":is(.dark *)": 1,
    },
    transform: {
      default: "rotate(-90deg)",
      ":is(.dark *)": "rotate(0deg)",
    },
  },
  darkIcon: {
    color: colors.secondary900,
    position: "absolute",
    inset: 0,
    transitionProperty: "opacity, transform",
    transitionDuration: "300ms",
    opacity: {
      default: 1,
      ":is(.dark *)": 0,
    },
    transform: {
      default: "rotate(0deg)",
      ":is(.dark *)": "rotate(90deg)",
    },
  },
});

export default function ThemeButton() {
  const handleToggleTheme = () => {
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggleTheme}
      {...stylex.props(styles.button)}
      aria-label="Toggle theme"
      type="button"
    >
      <MdOutlineLightMode
        size={24}
        {...stylex.props(styles.lightIcon)}
        aria-hidden="true"
      />
      <MdOutlineDarkMode
        size={24}
        {...stylex.props(styles.darkIcon)}
        aria-hidden="true"
      />
    </button>
  );
}
