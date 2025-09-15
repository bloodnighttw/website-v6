import { useContext } from "react";
import RouteContext from "./context";

export default function useNavigate() {
  const { setUrl } = useContext(RouteContext);
  return setUrl;
}
