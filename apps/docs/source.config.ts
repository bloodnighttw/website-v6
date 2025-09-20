import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import { remarkMdxFiles } from "fumadocs-core/mdx-plugins";

export const docs = defineDocs({
  dir: "docs/",
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMdxFiles],
  },
});
