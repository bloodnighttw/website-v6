import * as stylex from "@stylexjs/stylex";
import { colors, spacing, fontSize, radius } from "./tokens.stylex";

export const styles = stylex.create({
  card: {
    boxShadow: {
      default:
        "rgba(255, 255, 255, 0.2) 0px 0px 0px 1px, rgba(255, 255, 255, 0.8) 0px -1px 0px 0px",
      ":is(.dark *)":
        "rgba(255, 255, 255, 0.08) 0px 0px 0px 1px, rgba(255, 255, 255, 0.2) 0px -1px 0px 0px",
    },
  },

  container: {
    paddingLeft: {
      default: spacing.md,
      "@media (min-width: 640px)": spacing.lg,
      "@media (min-width: 1024px)": "2rem",
    },
    paddingRight: {
      default: spacing.md,
      "@media (min-width: 640px)": spacing.lg,
      "@media (min-width: 1024px)": "2rem",
    },
    maxWidth: "80rem",
    marginLeft: "auto",
    marginRight: "auto",
  },

  gradientBg: {
    background: {
      default: `radial-gradient(circle at 20% 30%, ${colors.accent200} 10%, transparent 40%),
                radial-gradient(circle at 80% 80%, ${colors.secondary200} 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, ${colors.primary50} 0%, ${colors.primary200} 100%)`,
      ":is(.dark *)": `radial-gradient(circle at 20% 30%, ${colors.accent950} 10%, transparent 40%),
                       radial-gradient(circle at 80% 80%, ${colors.secondary800} 0%, transparent 30%),
                       radial-gradient(circle at 50% 50%, ${colors.primary950} 100%, ${colors.primary900} 100%)`,
    },
    height: "100vh",
    width: "100vw",
  },

  bodyText: {
    color: {
      default: colors.primary950,
      ":is(.dark *)": colors.primary50,
    },
  },
});
