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
import { normalizePath } from "vite";
import { glob } from "glob";

type ApplicableOptions = Omit<CompileOptions, "SourceMapGenerator">;

interface ExtraOptions {
  exclude?: FilterPattern | null | undefined;
  include?: FilterPattern | null | undefined;
}

export type Options = ApplicableOptions & ExtraOptions;

function normalizePattern(pattern: FilterPattern): string[] {
  if (Array.isArray(pattern)) {
    return pattern.flatMap((p) =>
      p instanceof RegExp ? [] : typeof p === "string" ? [p] : [],
    );
  }
  if (pattern instanceof RegExp) {
    return [];
  }
  if (typeof pattern === "string") {
    return [pattern];
  }
  return [];
}

function getRelativePath(include: FilterPattern, filePath: string): string {
  const patterns = normalizePattern(include);

  for (const pattern of patterns) {
    const baseDir = pattern.split("*")[0].replace(/\/$/, "");
    const normalizedPath = normalizePath(filePath);

    if (normalizedPath.includes(baseDir)) {
      const relativePath = normalizedPath.split(baseDir + "/")[1];
      return relativePath || filePath;
    }
  }

  return filePath;
}

export default function mdx(sourceFns?: SourceFn[]): Plugin {
  let source: Source[];
  const VIRTUAL_PREFIX = "virtual:source:";

  return {
    name: "@rpress/mdx",
    config(_config, env) {
      source = sourceFns?.map((fn) => fn(env.mode === "development")) || [];
    },
    resolveId(id) {
      if (id.startsWith(VIRTUAL_PREFIX)) {
        return "\0" + id;
      }
    },
    async load(id) {
      if (id.startsWith("\0" + VIRTUAL_PREFIX)) {
        const sourceName = id.slice(("\0" + VIRTUAL_PREFIX).length);
        const matched = source.find((s) => s.name === sourceName);

        if (!matched) {
          throw new Error(`Source "${sourceName}" not found`);
        }

        const patterns = normalizePattern(matched.include);
        const ignorePatterns = matched.exclude
          ? normalizePattern(matched.exclude)
          : undefined;

        const files = await glob(patterns, {
          ignore: ignorePatterns,
        });

        const imports: string[] = [];
        const keys: string[] = [];

        for (const file of files) {
          const key = getRelativePath(matched.include, file);
          const importName = `__module_${imports.length}`;
          imports.push(`import * as ${importName} from '/${file}';`);
          keys.push(`  "${key}": ${importName}`);
        }

        return `${imports.join("\n")}\nexport default {\n${keys.join(",\n")}\n};`;
      }
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
