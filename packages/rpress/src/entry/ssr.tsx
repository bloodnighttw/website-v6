import * as ReactClient from "@vitejs/plugin-rsc/ssr";
import React from "react";
import * as ReactDomServer from "react-dom/server.edge";
import { injectRSCPayload } from "rsc-html-stream/server";
import { prerender } from "react-dom/static.edge";
import ShouldCaughtError from "../utils/shouldCaughtError";
import type { RscPayload } from "../utils/path/constant";

export async function renderHtml(
  rscStream: ReadableStream<Uint8Array>,
  options?: {
    ssg?: boolean;
  },
) {
  const [rscStream1, rscStream2] = rscStream.tee();

  let payload: Promise<RscPayload>;
  function SsrRoot() {
    payload ??= ReactClient.createFromReadableStream<RscPayload>(rscStream1);
    const root = React.use(payload).root;
    return root;
  }

  const bootstrapScriptContent =
    await import.meta.viteRsc.loadBootstrapScriptContent("index");

  let htmlStream: ReadableStream<Uint8Array>;
  try {
    if (options?.ssg) {
      const prerenderResult = await prerender(<SsrRoot />, {
        bootstrapScriptContent,
        onError: (e, info) => {
          if (e instanceof ShouldCaughtError) return;
          throw e;
        },
      });
      htmlStream = prerenderResult.prelude;
    } else {
      htmlStream = await ReactDomServer.renderToReadableStream(<SsrRoot />, {
        bootstrapScriptContent,
        onError: (e, info) => {
          if (e instanceof ShouldCaughtError) return;
          throw e;
        },
      });
    }
    let responseStream: ReadableStream<Uint8Array> = htmlStream;
    responseStream = responseStream.pipeThrough(injectRSCPayload(rscStream2));
    return responseStream;
  } catch (e) {
    throw e;
  }
}
