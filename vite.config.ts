import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pathToFileURL } from 'node:url'
import rsc from '@vitejs/plugin-rsc'
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import { type Plugin, type ResolvedConfig, defineConfig } from 'vite'
import inspect from 'vite-plugin-inspect'
import { HTML_POSTFIX, RSC_POSTFIX } from './src/framework/entry/shared'
import { normalize } from './src/framework/entry/shared/path'

export default defineConfig((env) => ({
  plugins: [
    mdx(),
    react(),
    rsc({
      entries: {
        client: './src/framework/entry/browser.tsx',
        rsc: './src/framework/entry/rsc.tsx',
        ssr: './src/framework/entry/ssr.tsx',
      },
      serverHandler: env.isPreview ? false : undefined,
      useBuildAppHook: true,
    }),
    rscSsgPlugin(),
    inspect(),
  ],
}))

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
  const entry: typeof import('./src/framework/entry/rsc') = await import(
    pathToFileURL(entryPath).href
  )

  // entry provides a list of static paths
  const staticPaths = entry.paths
  console.log('Static paths', staticPaths)

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
