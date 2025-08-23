import { type Plugin, type ResolvedConfig } from "vite";
import rsc from '@vitejs/plugin-rsc'
import path, { normalize } from "path";
import { pathToFileURL } from "url";
import { HTML_POSTFIX, RSC_POSTFIX } from "../entry/shared";
import { Readable } from "stream";
import fs from 'node:fs'

function rscSsgPlugin(): Plugin[] {
  return [
    {
      name: 'rsc-ssg',
      config(_config, env) {
        if (env.isPreview) {
          return {
            appType: 'mpa',
          }
        }
      },
      buildApp: {
        async handler(builder) {
          await renderStatic(builder.config)
        },
      },
    },
  ]
}

async function renderStatic(config: ResolvedConfig) {
  // import server entry
  const entryPath = path.join(config.environments.rsc.build.outDir, 'index.js')
  const entry: typeof import('../entry/rsc') = await import(
    pathToFileURL(entryPath).href
  )

  // entry provides a list of static paths
  const allRouteModules = entry.allRouteModules;

  const staticPaths = (await Promise.all(allRouteModules.map(async (module) => {
    const generator = module.config.config.generator;
    const matcher = module.config.matcher;

    const staticPaths = await generator();
    const result = staticPaths.map((staticPath) => {
      return matcher.toString(staticPath);
    });

    return result;
  }))).flat();

  // render rsc and html
  const baseDir = config.environments.client.build.outDir
  for (const staticPatch of staticPaths) {
    config.logger.info('[vite-rsc:ssg] -> ' + staticPatch)
    const { html, rsc } = await entry.handleSsg(
      new Request(new URL(staticPatch, 'http://ssg.local')),
    )
    await writeFileStream(
      path.join(baseDir, normalize(staticPatch)+HTML_POSTFIX),
      html,
    )
    await writeFileStream(path.join(baseDir, staticPatch + RSC_POSTFIX), rsc)
  }
}

async function writeFileStream(filePath: string, stream: ReadableStream) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true })
  await fs.promises.writeFile(filePath, Readable.fromWeb(stream as any))
}


export default function rscSSG():Plugin[] {
  return [
    ...rsc({
      entries: {
        client: './src/framework/entry/browser.tsx',
        rsc: './src/framework/entry/rsc.tsx',
        ssr: './src/framework/entry/ssr.tsx',
      },
      serverHandler: process.env.isPreview ? false : undefined,
      useBuildAppHook: true,
    }),
    ...rscSsgPlugin(),
  ]
}
