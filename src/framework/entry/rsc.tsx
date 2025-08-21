import * as ReactServer from '@vitejs/plugin-rsc/rsc'
import { Root } from '../../root'
import { type RscPayload } from './shared'
import { isRscRequest, normalizeByRequest } from './shared/path'
import ROUTE from "../../route"
import type { RouteModule } from '../route'

const routes = (await Promise.all(ROUTE)).reduce((acc,route) => {
  return {
    ...acc,
    ...route
  }
}, {} as Record<string, RouteModule>)

const paths = Object.keys(routes)

export { paths }

function generateRSCStream({request}: { request: Request }) {
  
  const normalizeUrl = normalizeByRequest(request)
  const url = new URL(normalizeUrl,new URL(request.url).origin)

  if(!routes[normalizeUrl]) {
    throw new Error(`No route found for ${normalizeUrl}`)
  }

  const module = routes[normalizeUrl];
  const RouteComponent = module.default;

  const rscPayload: RscPayload = { root: <Root children={<RouteComponent path={url.pathname} />} /> }
  const rscStream = ReactServer.renderToReadableStream<RscPayload>(rscPayload)
  return rscStream
}

export default async function handler(request: Request): Promise<Response> {

  const rscStream = generateRSCStream({ request })


  if (isRscRequest(request)) {
    return new Response(rscStream, {
      headers: {
        'content-type': 'text/x-component;charset=utf-8',
        vary: 'accept',
      },
    })
  }

  // to prevent circular import
  const ssr = await import.meta.viteRsc.loadModule<
    typeof import('./ssr')
  >('ssr', 'index')
  const htmlStream = await ssr.renderHtml(rscStream)

  return new Response(htmlStream, {
    headers: {
      'content-type': 'text/html;charset=utf-8',
      vary: 'accept',
    },
  })
}

// return both rsc and html streams at once for ssg
export async function handleSsg(request: Request): Promise<{
  html: ReadableStream<Uint8Array>
  rsc: ReadableStream<Uint8Array>
}> {
  
  const rscStream = generateRSCStream({ request });
  const [rscStream1, rscStream2] = rscStream.tee()

  const ssr = await import.meta.viteRsc.loadModule<
    typeof import('./ssr')
  >('ssr', 'index')
  const htmlStream = await ssr.renderHtml(rscStream1, {
    ssg: true,
  })

  return { html: htmlStream, rsc: rscStream2 }
}

if (import.meta.hot) {
  import.meta.hot.accept()
}
