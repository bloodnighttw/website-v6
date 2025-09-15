import { createContext } from "react";

export const RouteContext = createContext<{
  setUrl: (url: string) => void;
}>({
  setUrl: () => {},
});

export default RouteContext;
