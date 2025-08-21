import { route, type Routes } from "./framework/route";

export default [
    route("/","index.tsx"),
    route("/wtf", "index.tsx")
] satisfies Routes