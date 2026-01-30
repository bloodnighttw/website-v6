import * as stylex from "@stylexjs/stylex";
import { gap } from "./layout.stylex";

export const flex = stylex.create({
  wrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: gap["2"],
  },
  col: {
    display: "flex",
    flexDirection: "column",
    gap: gap["4"],
  },
  flex1: {
    flex: 1,
  },
});
