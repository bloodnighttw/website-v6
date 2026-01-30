import * as stylex from "@stylexjs/stylex";
import { colors, radius, spacing, fontSize } from "@/styles/tokens.stylex";
import { styles as globalStyles } from "@/styles/styles";
import Card from ".";

const styles = stylex.create({
  label: {
    height: "2.5rem",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    paddingLeft: spacing.xl,
    paddingRight: spacing.xl,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.full,
    fontSize: fontSize.lg,
    backgroundColor: {
      ":hover": "rgba(28, 25, 23, 0.05)",
      ":is(.dark *):hover": "rgba(245, 245, 244, 0.05)",
    },
    transitionProperty: "background-color",
    transitionDuration: "200ms",
  },
});

export default function CardLabel(props: {
  children: React.ReactNode;
  className?: stylex.StyleXStyles;
}) {
  return (
    <Card {...stylex.props(styles.label, props.className)}>
      {props.children}
    </Card>
  );
}
