import path from "path";
import { pathToFileURL } from "url";
import type { Plugin, ResolvedConfig } from "vite";
import fs from "node:fs";
import { Readable } from "node:stream";
import { normalized2html, normalized2rsc } from "../utils/path/normalize";
import { normalize } from "node:path";

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

  const all = entry.allRouteModules;
  const strss = await Promise.all(
    all.map(async (module) => {
      const usePath = module.route.matcher.noKeysUsePath();
      if (typeof usePath === "string") {
        return [usePath];
      }

      const path = module.route.config.generator as unknown as () => Promise<
        Record<string, string>[]
      >;
      const matcher = module.route.matcher;

      const strs = (await path()).map((params) => {
        return matcher.toString(params);
      });

      return strs;
    }),
  );

  const pathnames = strss.reduce((acc, curr) => {
    return [...acc, ...curr];
  }, []);

  // render rsc and html
  const baseDir = config.environments.client.build.outDir;
  for (const pathname of pathnames) {
    config.logger.info(
      `\x1b[36m[vite-rsc:ssg]\x1b[0m -> \x1b[32m${pathname}\x1b[0m`,
    );
    const { html, rsc } = await entry.handleSsg(
      new Request(new URL(pathname, "http://ssg.local")),
    );
    await writeFileStream(
      path.join(baseDir, normalized2html(normalize(pathname))),
      html,
    );
    await writeFileStream(
      path.join(baseDir, normalized2rsc(normalize(pathname))),
      rsc,
    );
  }
}

async function writeFileStream(filePath: string, stream: ReadableStream) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, Readable.fromWeb(stream as never));
}
