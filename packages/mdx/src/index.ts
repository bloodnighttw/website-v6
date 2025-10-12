// This is originally from @mdx-js/rollup, but modified to work with mutiple mdx instances
// and with some customizations, like frontmatter with zod validation and so on.
//
// The original source of @mdx-js/rollup is open source under the MIT license, and you can
// find it here: https://github.com/mdx-js/mdx

import type { CompileOptions } from "@mdx-js/mdx";
import type { FilterPattern } from "@rollup/pluginutils";
import type { SourceDescription } from "rollup";
import { VFile } from "vfile";
import type { Plugin } from "vite";
import type { Source, SourceFn } from "./source";

type ApplicableOptions = Omit<CompileOptions, "SourceMapGenerator">;

interface ExtraOptions {
  exclude?: FilterPattern | null | undefined;
  include?: FilterPattern | null | undefined;
}

export type Options = ApplicableOptions & ExtraOptions;

export default function mdx(sourceFns?: SourceFn[]): Plugin {
  let source: Source[];

  return {
    name: "@rpress/mdx",
    config(_config, env) {
      source = sourceFns?.map((fn) => fn(env.mode === "development")) || [];
    },
    async transform(value, id) {
      const matched = source.find(({ filter }) => filter(id));
      if (!matched) return null;
      const { formatAwareProcessors } = matched;

      const [path] = id.split("?");
      const file = new VFile({ path, value });

      if (
        file.extname &&
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

export type { Source, SourceFn };

export { default as source } from "./source";
