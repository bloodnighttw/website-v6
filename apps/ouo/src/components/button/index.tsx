import { cn } from "@/utils/cn";

type varient = "primary" | "secondary" | "outline";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  varient?: varient;
}

export function Button(props: ButtonProps) {
  const { varient = "primary", className, children, disabled, ...rest } = props;

  const baseStyles =
    "px-4 py-1 rounded focus:outline-0 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center cursor-pointer h-8";

  const focusStyles = "focus:ring-2 focus:ring-offset-2";

  const animationStyles =
    "transition-all duration-200 ease-in-out active:scale-90";

  const fontStyles = "font-medium text-sm";

  const varientStyles: Record<varient, string> = {
    primary:
      "bg-primary-800 text-primary-50 enabled:hover:bg-primary-950 focus:ring-primary-500 dark:bg-primary-200 dark:enabled:hover:bg-primary-50 dark:text-primary-950 ",
    secondary:
      "bg-secondary-800 text-secondary-50 enabled:hover:bg-secondary-950 focus:ring-secondary-500 dark:bg-secondary-200 dark:enabled:hover:bg-secondary-50 dark:text-secondary-950",
    outline:
      "border border-primary-900 text-primary-900 dark:border-primary-100 dark:text-primary-100 enabled:hover:bg-primary-400/10",
  };

  const focusVariantStyles: Record<varient, string> = {
    primary:
      "dark:focus:ring-primary-100 focus:ring-primary-900 ring-offset-primary-50 dark:ring-offset-primary-950",
    secondary:
      "dark:focus:ring-secondary-100 focus:ring-secondary-900 ring-offset-secondary-50 dark:ring-offset-secondary-950",
    outline:
      "focus:ring-0 focus:ring-offset-0 border-primary-600 dark:border-primary-300 focus:bg-primary-400/10",
  };

  return (
    <button
      className={cn(
        baseStyles,
        animationStyles,
        fontStyles,
        varientStyles[varient],
        focusStyles,
        focusVariantStyles[varient],
        className,
      )}
      {...rest}
      type="button"
      disabled={disabled}
    >
      {children}
    </button>
  );
}
