import * as ReactClient from "@vitejs/plugin-rsc/browser";
import React from "react";
import ReactDomClient from "react-dom/client";
import { rscStream } from "rsc-html-stream/client";
import { RSC_POSTFIX, type RscPayload } from "./shared";
import load from "../loader";

async function fetchRSC() {

  const normalizedHref = window.location.href;
  const rscURL = new URL(normalizedHref + RSC_POSTFIX, window.location.origin);
  const payload = await load(rscURL.href);
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

  const browserRoot = (
    <React.StrictMode>
      <BrowserRoot initialPayload={initialPayload} />
    </React.StrictMode>
  );

  ReactDomClient.hydrateRoot(document, browserRoot);

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

  function onClick(e: MouseEvent) {
    const link = (e.target as Element).closest("a");
    if (
      link &&
      link instanceof HTMLAnchorElement &&
      link.href &&
      (!link.target || link.target === "_self") &&
      link.origin === location.origin &&
      !link.hasAttribute("download") &&
      e.button === 0 && // left clicks only
      !e.metaKey && // open in new tab (mac)
      !e.ctrlKey && // open in new tab (windows)
      !e.altKey && // download
      !e.shiftKey &&
      !e.defaultPrevented
    ) {
      e.preventDefault();
      history.pushState(null, "", link.href);
    }
  }
  document.addEventListener("click", onClick);

  return () => {
    document.removeEventListener("click", onClick);
    window.removeEventListener("popstate", onNavigation);
    window.history.pushState = oldPushState;
    window.history.replaceState = oldReplaceState;
  };
}

hydrate();
