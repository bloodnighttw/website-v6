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
  const virtualModuleCache = new Map<string, Set<string>>();

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
    configureServer(server) {
      // Watch for MDX file add/delete and trigger HMR
      server.watcher.on("all", async (event, path) => {
        if (event === "add" || event === "unlink") {
          const normalizedPath = normalizePath(path);

          // Check if the changed file matches any source
          for (const src of source) {
            if (src.filter(normalizedPath)) {
              const virtualId = "\0" + VIRTUAL_PREFIX + src.name;

              // Clear the cache to force reload on next import
              virtualModuleCache.delete(virtualId);

              // Invalidate modules in all available environments (client, ssr, etc.)
              if (server.environments) {
                for (const env of Object.values(server.environments)) {
                  if (env.moduleGraph) {
                    const envModule = env.moduleGraph.getModuleById(virtualId);
                    if (envModule) {
                      // Invalidate in this environment
                      env.moduleGraph.invalidateModule(envModule);

                      // Collect and invalidate all importers recursively
                      const collectImporters = (mod: typeof envModule) => {
                        mod.importers.forEach((importer) => {
                          env.moduleGraph.invalidateModule(importer);
                          collectImporters(importer);
                        });
                      };

                      collectImporters(envModule);
                    }
                  }
                }
              }

              // Send full reload to ensure all changes are picked up
              server.ws.send({
                type: "full-reload",
                path: "*",
              });

              break;
            }
          }
        }
      });
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
        const fileSet = new Set<string>();

        for (const file of files) {
          const normalizedFile = normalizePath(file);
          fileSet.add(normalizedFile);

          const key = getRelativePath(matched.include, normalizedFile).replace(
            /\.mdx$/,
            "",
          );
          const importName = `__module_${imports.length}`;
          imports.push(`import * as ${importName} from '/${normalizedFile}';`);
          keys.push(`  "${key}": ${importName}`);
        }

        // Cache the files for this virtual module for HMR tracking
        virtualModuleCache.set(id, fileSet);

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
        const compiled = await formatAwareProcessors.process(file);
        const code = String(compiled.value);
        const result: SourceDescription = { code, map: compiled.map };
        return result;
      }
    },
    handleHotUpdate(ctx) {
      const normalizedPath = normalizePath(ctx.file);

      // Check if the changed file is an MDX file tracked by any virtual module
      for (const src of source) {
        if (src.filter(normalizedPath)) {
          const virtualId = "\0" + VIRTUAL_PREFIX + src.name;
          const virtualModule = ctx.server.moduleGraph.getModuleById(virtualId);

          if (virtualModule) {
            // Invalidate the virtual module so it regenerates with updated file list
            ctx.server.moduleGraph.invalidateModule(virtualModule);

            // Return both the changed module and the virtual module
            return [virtualModule, ...ctx.modules];
          }
        }
      }
    },
  };
}

export type { Source, SourceFn };

export { default as source } from "./source";
