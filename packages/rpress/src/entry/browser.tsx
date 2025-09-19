import * as ReactClient from "@vitejs/plugin-rsc/browser";
import React, { useEffect, useState } from "react";
import ReactDomClient from "react-dom/client";
import { rscStream } from "rsc-html-stream/client";
import { type RscPayload } from "@/libs/utils/path/constant";

import normalize, { normalized2rsc } from "@/libs/utils/path/normalize";

const b = new Map<string, Promise<RscPayload>>();

function load(url: string) {
  url = normalized2rsc(normalize(url));

  if (!b.has(url)) {
    const payload = ReactClient.createFromFetch<RscPayload>(fetch(url));
    b.set(url, payload);
  }
  return b.get(url)!;
}

if (import.meta.hot) {
  import.meta.hot.on("rsc:update", () => {
    b.clear();
  });
}

// we export it to prevent hmr invalidate.
// (fast-refresh require a default export)
export default function BrowserRoot({
  initialPayload,
}: {
  initialPayload: RscPayload;
}) {
  const [payload, setPayload] = useState(initialPayload);

  useEffect(() => {
    // add a event listener to handle popstate
    // so that we can handle back/forward button

    const onPopState = () => {
      load(window.location.pathname).then(setPayload);
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  // this is fine because import.meta.hot will not change, and the useEffect will only run once
  // to subscribe to the rsc:update event
  if (import.meta.hot) {
    useEffect(() => {
      const onRscUpdate = () => {
        load(window.location.pathname).then(setPayload);
      };
      import.meta.hot!.on("rsc:update", onRscUpdate);
      return () => {
        import.meta.hot?.off("rsc:update", onRscUpdate);
      };
    }, []);
  }

  return payload.root;
}

async function hydrate(): Promise<void> {
  const initialPayload =
    await ReactClient.createFromReadableStream<RscPayload>(rscStream);

  const browserRoot = (
    <React.StrictMode>
      <BrowserRoot initialPayload={initialPayload} />
    </React.StrictMode>
  );

  const dealWithInternelError = () => {
    // ignore the error from rsc
  };

  ReactDomClient.hydrateRoot(document, browserRoot, {
    onRecoverableError: dealWithInternelError,
  });
}

hydrate();
