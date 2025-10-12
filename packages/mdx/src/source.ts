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
import { parse } from "yaml";

type MdxOptions = Omit<CompileOptions, "SourceMapGenerator">;

interface FileOptions {
  exclude?: FilterPattern | null | undefined;
  include: FilterPattern;
}

type AllOptions = MdxOptions & FileOptions;

interface SourceOptions extends AllOptions {
  name: string;
  transform?: (url: string) => string;
}

function remarkVisitYaml() {
  return (tree: Root) => {
    visit(tree, "yaml", (node) => {
      // console.log("YAML node:", node.value);
      const data = parse(node.value);
      console.log("Parsed YAML data:", data);
    });
  };
}

export default function source(options: SourceOptions) {
  const { name, exclude, include, transform, remarkPlugins, ...rest } =
    options || {};
  const filter = createFilter(include, exclude);

  return (dev: boolean) => {
    let formatAwareProcessors: FormatAwareProcessors =
      createFormatAwareProcessors({
        SourceMapGenerator,
        development: dev,
        remarkPlugins: [
          remarkFrontmatter,
          remarkVisitYaml,
          ...(remarkPlugins || []),
        ],
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
