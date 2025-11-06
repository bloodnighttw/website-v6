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

        // Build glob patterns for import.meta.glob
        const globPatterns = patterns.map((p) => `/${p}`);

        // Get base directory to strip from paths
        const baseDir = patterns[0]?.split("*")[0].replace(/\/$/, "") || "";

        // Use import.meta.glob to leverage Vite's HMR
        const code = `
const modules = import.meta.glob(${JSON.stringify(globPatterns)}, { 
  eager: false${ignorePatterns ? `,\n  ignore: ${JSON.stringify(ignorePatterns)}` : ""}
});

const result = {};

for (const [path, moduleLoader] of Object.entries(modules)) {
  const module = await moduleLoader();
  
  // Extract key from path
  let key = path.slice(1); // Remove leading slash
  
  // Remove base directory
  if (key.startsWith('${baseDir}/')) {
    key = key.slice(${baseDir.length + 1});
  }
  
  // Remove .mdx extension
  key = key.replace(/\\.mdx$/, '');
  
  result[key] = module;
}

export default result;
`;

        return code;
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
    configureServer(server) {
      const handleFileChange = (file: string) => {
        const normalizedFile = normalizePath(file);

        // Check if the file matches any source pattern
        for (const src of source) {
          if (src.filter(normalizedFile)) {
            server.config.logger.info(
              `\x1b[36m[@rpress/mdx]\x1b[0m File change detected: ${normalizedFile}`,
            );

            // Invalidate the virtual module to trigger re-evaluation of import.meta.glob
            const moduleId = `\0${VIRTUAL_PREFIX}${src.name}`;
            const module = server.moduleGraph.getModuleById(moduleId);
            if (module) {
              server.moduleGraph.invalidateModule(module);

              // Invalidate importers recursively
              const invalidateImporters = (mod: typeof module) => {
                for (const importer of mod.importers) {
                  server.moduleGraph.invalidateModule(importer);
                  invalidateImporters(importer);
                }
              };
              invalidateImporters(module);
            }

            // Send full reload to client
            server.ws.send({
              type: "full-reload",
              path: "*",
            });

            server.config.logger.info(
              `\x1b[36m[@rpress/mdx]\x1b[0m Reloaded source: ${src.name}`,
            );
            break;
          }
        }
      };

      // Watch for new files and deletions
      server.watcher.on("add", handleFileChange);
      server.watcher.on("unlink", handleFileChange);
    },
  };
}

export type { Source, SourceFn };

export { default as source } from "./source";
