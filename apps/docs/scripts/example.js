import { register } from "node:module";

register("fumadocs-mdx/node/loader", import.meta.url);

// accessing content
const { source } = await import("./lib/source");
console.log(source.getPages());
