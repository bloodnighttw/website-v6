import { cn } from "@/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card(props: CardProps) {
  const old = "rounded-xl bg-secondary-500/5 backdrop-blur-2xl card";
  const { className, ...rest } = props;

  return (
    <div className={cn(old, className)} {...rest}>
      {props.children}
    </div>
  );
}
