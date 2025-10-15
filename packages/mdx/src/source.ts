import type { CompileOptions } from "@mdx-js/mdx";
import {
  createFormatAwareProcessors,
  type FormatAwareProcessors,
} from "@mdx-js/mdx/internal-create-format-aware-processors";
import { SourceMapGenerator } from "source-map";
import { createFilter, type FilterPattern } from "vite";
import remarkFrontmatter from "remark-frontmatter";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import type { Program } from "estree";
import { parse } from "yaml";
import { z } from "zod";
import type { VFile } from "vfile";

type MdxOptions = Omit<CompileOptions, "SourceMapGenerator">;

interface FileOptions {
  exclude?: FilterPattern | null | undefined;
  include: FilterPattern;
}

type AllOptions = MdxOptions & FileOptions;

interface SourceOptions<Z extends z.ZodType> extends AllOptions {
  name: string;
  transform?: (url: string) => string;
  schema?: Z;
}

function remarkYamlValidation(schema?: z.ZodType) {
  const validationSchema = schema;

  return () => (tree: Root, vfile: VFile) => {
    visit(tree, "yaml", (node) => {
      const data = parse(node.value);
      const dataParse = validationSchema?.parse(data);
      vfile.data.zod = dataParse || data;
    });
  };
}

function recmaInjectFrontmatter() {
  return () => (tree: Program, vfile: VFile) => {
    if (vfile.data.zod) {
      tree.body.push({
        type: "ExportNamedDeclaration",
        declaration: {
          type: "VariableDeclaration",
          declarations: [
            {
              type: "VariableDeclarator",
              id: { type: "Identifier", name: "zod" },
              init: {
                type: "Literal",
                value: JSON.stringify(vfile.data.zod),
                raw: JSON.stringify(vfile.data.zod),
              } as any,
            },
          ],
          kind: "const",
        },
        specifiers: [],
      } as any);
    }
  };
}

export default function source<Z extends z.ZodType>(options: SourceOptions<Z>) {
  const {
    name,
    exclude,
    include,
    transform,
    schema,
    remarkPlugins,
    recmaPlugins,
    ...rest
  } = options || {};
  const filter = createFilter(include, exclude);

  return (dev: boolean) => {
    let formatAwareProcessors: FormatAwareProcessors =
      createFormatAwareProcessors({
        SourceMapGenerator,
        development: dev,
        remarkPlugins: [
          remarkFrontmatter,
          remarkYamlValidation(schema),
          ...(remarkPlugins || []),
        ],
        recmaPlugins: [recmaInjectFrontmatter(), ...(recmaPlugins || [])],
        ...rest,
      });

    return {
      dev, // is development mode
      name, // name of the source
      filter, // filter function
      include,
      exclude,
      formatAwareProcessors,
      transform,
    };
  };
}

type SourceFn = ReturnType<typeof source>;
type Source = ReturnType<SourceFn>;

export type { SourceFn, Source, SourceOptions };
