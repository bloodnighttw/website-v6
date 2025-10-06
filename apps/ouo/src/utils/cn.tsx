import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...classes: (string | false | undefined)[]) {
  return clsx(twMerge(classes));
}
