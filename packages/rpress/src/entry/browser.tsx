import * as ReactClient from "@vitejs/plugin-rsc/browser";
import React, {
  startTransition,
  useCallback,
  useEffect,
  useState,
} from "react";
import ReactDomClient from "react-dom/client";
import { rscStream } from "rsc-html-stream/client";
import { type RscPayload } from "@/libs/utils/path/constant";
import config from "virtual:rpress:config";
import load from "virtual:rpress:rsc-loader";
import RouteContext from "@/libs/route/context";

// Store scroll positions for each URL
const scrollHistory = new Map<string, number>();

// we export it to prevent hmr invalidate.
// (fast-refresh require a default export)
export default function BrowserRoot({
  initialPayload,
}: {
  initialPayload: RscPayload;
}) {
  const [payload, setPayload] = useState(initialPayload);

  const setUrl = useCallback((url: string) => {
    // Save current scroll position before navigating
    const currentUrl = window.location.pathname;
    scrollHistory.set(currentUrl, window.scrollY);

    load(url).then((payload: RscPayload) => {
      window.history.pushState({}, "", url);
      // Reset scroll to top for new page navigation
      window.scrollTo(0, 0);
      // to mark it as non-urgent
      startTransition(() => {
        setPayload(payload);
      });
    });
  }, []);

  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // add a event listener to handle popstate
    // so that we can handle back/forward button

    const onPopState = () => {
      const targetUrl = window.location.pathname;

      load(targetUrl).then((payload) => {
        // Restore scroll position if we have it saved, otherwise reset to top
        const savedPosition = scrollHistory.get(targetUrl);
        window.scrollTo(0, savedPosition ?? 0);
        startTransition(() => {
          setPayload(payload);
        });
      });
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

  return <RouteContext value={{ setUrl: setUrl }}>{payload.root}</RouteContext>;
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

  const dealWithInternelError = () => {
    // ignore the error from rsc
  };

  ReactDomClient.hydrateRoot(document, browserRoot, {
    onRecoverableError: dealWithInternelError,
  });
}

hydrate();
