import * as ReactClient from "@vitejs/plugin-rsc/browser";
import React from "react";
import ReactDomClient from "react-dom/client";
import { rscStream } from "rsc-html-stream/client";
import { type RscPayload } from "../utils/path/constant";
import config from "virtual:rpress:config";
import load from "../core/rsc-loader";

async function fetchRSC() {
  const payload = await load(window.location.pathname);
  return payload;
}

// we export it to prevent hmr invalidate.
// (fast-refresh require a default export)
export default function BrowserRoot({
  initialPayload,
}: {
  initialPayload: RscPayload;
}) {
  const [payload, setPayload] = React.useState(initialPayload);

  React.useEffect(() => {
    const onNavigation = () => {
      fetchRSC().then(setPayload);
    };
    return listenNavigation(onNavigation);
  }, []);

  return payload.root;
}

async function hydrate(): Promise<void> {
  const initialPayload =
    await ReactClient.createFromReadableStream<RscPayload>(rscStream);

  const browserRoot = config.strictMode ? (
    <React.StrictMode>
      <BrowserRoot initialPayload={initialPayload} />
    </React.StrictMode>
  ) : (
    <BrowserRoot initialPayload={initialPayload} />
  );

  const dealWithInternelError = (e: unknown, info: unknown) => {
    console.debug("An Internal Exception has been dealed", e, info);
  };

  ReactDomClient.hydrateRoot(document, browserRoot, {
    onRecoverableError: dealWithInternelError,
  });

  if (import.meta.hot) {
    import.meta.hot.on("rsc:update", () => {
      window.history.replaceState({}, "", window.location.href);
    });
  }
}

function listenNavigation(onNavigation: () => void): () => void {
  window.addEventListener("popstate", onNavigation);

  const oldPushState = window.history.pushState;
  window.history.pushState = function (...args) {
    const res = oldPushState.apply(this, args);
    onNavigation();
    return res;
  };

  const oldReplaceState = window.history.replaceState;
  window.history.replaceState = function (...args) {
    const res = oldReplaceState.apply(this, args);
    onNavigation();
    return res;
  };

  return () => {
    window.removeEventListener("popstate", onNavigation);
    window.history.pushState = oldPushState;
    window.history.replaceState = oldReplaceState;
  };
}

hydrate();
