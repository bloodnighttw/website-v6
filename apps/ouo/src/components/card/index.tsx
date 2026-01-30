import { cn } from "@/utils/cn";
import * as stylex from "@stylexjs/stylex";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const styles = stylex.create({
  card: {
    borderRadius: "0.75rem",
  },
});

export default function Card(props: CardProps) {
  const old = "bg-secondary-500/5 card";
  const { className, ...rest } = props;

  return (
    <div
      {...stylex.props(styles.card)}
      className={cn(old, className)}
      {...rest}
    >
      {props.children}
    </div>
  );
}
