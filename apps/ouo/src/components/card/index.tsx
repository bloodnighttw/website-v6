import "./card.css";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card(props: CardProps) {
  return (
    <div className="p-4 rounded-2xl card bg-secondary-200/50 dark:bg-secondary-900/40 backdrop-blur-2xl">
      {props.children}
    </div>
  );
}
