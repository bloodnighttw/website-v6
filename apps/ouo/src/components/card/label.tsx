import { cn } from "@/utils/cn";
import Card from ".";

export default function CardLabel(props: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "h-10 py-2 px-8 flex justify-center items-center",
        "rounded-full text-lg hover:bg-secondary-950/5 dark:hover:bg-secondary-100/5",
        "duration-200 transition-colors",
        props.className,
      )}
    >
      {props.children}
    </Card>
  );
}
