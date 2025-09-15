import { createContext, useContext } from "react";

const RouteContext = createContext<{
  setUrl: (url: string) => void;
}>({
  setUrl: () => {},
});

export default RouteContext;

export function useNavigate() {
  const { setUrl } = useContext(RouteContext);
  return setUrl;
}
