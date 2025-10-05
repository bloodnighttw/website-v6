import { cn } from "@/utils/cn";
import "./card.css";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card(props: CardProps) {
  const old = "rounded-xl card bg-secondary-500/5 backdrop-blur-2xl";
  const { className, ...rest } = props;

  return (
    <div className={cn(old, className)} {...rest}>
      {props.children}
    </div>
  );
}
