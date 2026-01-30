import * as stylex from "@stylexjs/stylex";

export function cn(
  ...styles: (stylex.StyleXStyles | false | undefined | null)[]
): string {
  return stylex.props(...styles.filter(Boolean)).className ?? "";
}
