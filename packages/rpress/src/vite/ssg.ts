import path from "path";
import { pathToFileURL } from "url";
import type { Plugin, ResolvedConfig } from "vite";
import fs from "node:fs";
import { HTML_POSTFIX, RSC_POSTFIX } from "../config";
import { Readable } from "node:stream";

export function rscSsgPlugin(): Plugin[] {
  return [
    {
      name: "rpress:rsc-ssg",
      config(_config, env) {
        if (env.isPreview) {
          return {
            appType: "mpa",
          };
        }
      },
      buildApp: {
        async handler(builder) {
          await renderStatic(builder.config);
        },
      },
    },
  ];
}

async function renderStatic(config: ResolvedConfig) {
  // import server entry
  const entryPath = path.join(config.environments.rsc.build.outDir, "index.js");
  const entry: typeof import("../entry/rsc") = await import(
    pathToFileURL(entryPath).href
  );

  const mapping = [] as string[];

  // render rsc and html
  const baseDir = config.environments.client.build.outDir;
  for (const pathname of Object.keys(mapping)) {
    config.logger.info(
      `\x1b[36m[vite-rsc:ssg]\x1b[0m -> \x1b[32m${pathname}\x1b[0m`,
    );
    const { html, rsc } = await entry.handleSsg(
      new Request(new URL(pathname, "http://ssg.local")),
    );
    await writeFileStream(path.join(baseDir, pathname + HTML_POSTFIX), html);
    await writeFileStream(path.join(baseDir, pathname + RSC_POSTFIX), rsc);
  }
}

async function writeFileStream(filePath: string, stream: ReadableStream) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, Readable.fromWeb(stream as never));
}
