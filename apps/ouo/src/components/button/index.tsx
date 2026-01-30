import * as stylex from "@stylexjs/stylex";
import { colors, spacing, fontSize, radius } from "@/styles/tokens.stylex";

type variant = "primary" | "secondary" | "outline";

const styles = stylex.create({
  base: {
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    paddingTop: "0.25rem",
    paddingBottom: "0.25rem",
    borderRadius: radius.md,
    outline: "none",
    opacity: {
      ":disabled": 0.5,
    },
    cursor: {
      default: "pointer",
      ":disabled": "not-allowed",
    },
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: "2rem",
  },

  focus: {
    boxShadow: {
      ":focus": "0 0 0 2px, 0 0 0 4px",
    },
  },

  animation: {
    transitionProperty: "all",
    transitionDuration: "200ms",
    transitionTimingFunction: "ease-in-out",
    transform: {
      ":active:not(:disabled)": "scale(0.9)",
    },
  },

  font: {
    fontWeight: 500,
    fontSize: fontSize.sm,
  },

  primary: {
    backgroundColor: {
      default: colors.primary800,
      ":hover:not(:disabled)": colors.primary950,
      ":is(.dark *)": colors.primary200,
      ":is(.dark *):hover:not(:disabled)": colors.primary50,
    },
    color: {
      default: colors.primary50,
      ":is(.dark *)": colors.primary950,
    },
  },

  secondary: {
    backgroundColor: {
      default: colors.secondary800,
      ":hover:not(:disabled)": colors.secondary950,
      ":is(.dark *)": colors.secondary200,
      ":is(.dark *):hover:not(:disabled)": colors.secondary50,
    },
    color: {
      default: colors.secondary50,
      ":is(.dark *)": colors.secondary950,
    },
  },

  outline: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: {
      default: colors.primary900,
      ":is(.dark *)": colors.primary100,
    },
    color: {
      default: colors.primary900,
      ":is(.dark *)": colors.primary100,
    },
    backgroundColor: {
      ":hover:not(:disabled)": "rgba(161, 161, 170, 0.1)",
    },
  },

  primaryFocus: {
    boxShadow: {
      ":focus": `0 0 0 2px ${colors.primary500}, 0 0 0 4px ${colors.primary50}`,
      ":is(.dark *):focus": `0 0 0 2px ${colors.primary100}, 0 0 0 4px ${colors.primary950}`,
    },
    backgroundColor: {
      ":focus": colors.primary950,
      ":is(.dark *):focus": colors.primary50,
    },
  },

  secondaryFocus: {
    boxShadow: {
      ":focus": `0 0 0 2px ${colors.secondary500}, 0 0 0 4px ${colors.secondary50}`,
      ":is(.dark *):focus": `0 0 0 2px ${colors.secondary100}, 0 0 0 4px ${colors.secondary950}`,
    },
    backgroundColor: {
      ":focus": colors.secondary950,
      ":is(.dark *):focus": colors.secondary50,
    },
  },

  outlineFocus: {
    boxShadow: {
      ":focus": "none",
    },
    borderColor: {
      ":focus": colors.primary600,
      ":is(.dark *):focus": colors.primary300,
    },
    backgroundColor: {
      ":focus": "rgba(161, 161, 170, 0.1)",
    },
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: variant;
}

export function Button(props: ButtonProps) {
  const { variant = "primary", className, children, disabled, ...rest } = props;

  const variantStyles = {
    primary: [styles.primary, styles.primaryFocus],
    secondary: [styles.secondary, styles.secondaryFocus],
    outline: [styles.outline, styles.outlineFocus],
  };

  return (
    <button
      {...stylex.props(
        styles.base,
        styles.animation,
        styles.font,
        ...variantStyles[variant],
        className as stylex.StyleXStyles,
      )}
      {...rest}
      type="button"
      disabled={disabled}
    >
      {children}
    </button>
  );
}
