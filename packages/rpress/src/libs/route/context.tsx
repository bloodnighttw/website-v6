import { createContext } from "react";

export const RouteContext = createContext<{
  setUrl: (url: string) => void;
}>({
  setUrl: () => {
    throw new Error("setUrl called outside of RouteContext provider");
  },
});

export default RouteContext;
