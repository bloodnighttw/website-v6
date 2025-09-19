import { loader } from "fumadocs-core/source";
import { create, docs } from "../../source.generated.ts";

const mdx = await create.sourceAsync(docs.doc, docs.meta);

export const source = loader({
  source: mdx,
  baseUrl: "/docs",
});
