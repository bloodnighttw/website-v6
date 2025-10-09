// This is originally from @mdx-js/rollup, but modified to work with mutiple mdx instances
// and with some customizations, like frontmatter with zod validation and so on.

import type { FormatAwareProcessors } from "@mdx-js/mdx/internal-create-format-aware-processors";
import type { CompileOptions } from "@mdx-js/mdx";
import type { FilterPattern } from "@rollup/pluginutils";
import type { SourceDescription } from "rollup";
import { createFormatAwareProcessors } from "@mdx-js/mdx/internal-create-format-aware-processors";
import { createFilter } from "@rollup/pluginutils";
import { SourceMapGenerator } from "source-map";
import { VFile } from "vfile";
import type { Plugin } from "vite";

type ApplicableOptions = Omit<CompileOptions, "SourceMapGenerator">;

interface ExtraOptions {
  exclude?: FilterPattern | null | undefined;
  include?: FilterPattern | null | undefined;
}

export type Options = ApplicableOptions & ExtraOptions;

export default function mdx(options?: Readonly<Options> | null): Plugin {
  const { exclude, include, ...rest } = options || {};
  let formatAwareProcessors: FormatAwareProcessors;
  const filter = createFilter(include, exclude);

  return {
    name: "@mdx-js/rollup",
    config(_config, env) {
      formatAwareProcessors = createFormatAwareProcessors({
        SourceMapGenerator,
        development: env.mode === "development",
        ...rest,
      });
    },
    async transform(value, id) {
      if (!formatAwareProcessors) {
        formatAwareProcessors = createFormatAwareProcessors({
          SourceMapGenerator,
          ...rest,
        });
      }

      const [path] = id.split("?");
      const file = new VFile({ path, value });

      if (
        file.extname &&
        filter(file.path) &&
        formatAwareProcessors.extnames.includes(file.extname)
      ) {
        console.log("mdx transform", { id });
        const compiled = await formatAwareProcessors.process(file);
        const code = String(compiled.value);
        const result: SourceDescription = { code, map: compiled.map };
        return result;
      }
    },
  };
}
