import * as stylex from "@stylexjs/stylex";
import { colors, radius } from "@/styles/tokens.stylex";
import { styles as globalStyles } from "@/styles/styles";

const styles = stylex.create({
  card: {
    borderRadius: radius.xl,
    backgroundColor: "rgba(120, 113, 108, 0.05)",
  },
});

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card(props: CardProps) {
  const { className, ...rest } = props;

  return (
    <div
      {...stylex.props(
        styles.card,
        globalStyles.card,
        className as stylex.StyleXStyles,
      )}
      {...rest}
    >
      {props.children}
    </div>
  );
}
