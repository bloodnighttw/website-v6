import { createContext } from "react";
import React from "react";
import type { RscPayload } from "../../utils/path/constant";

const RouteContext = createContext<{
  setRscPayload: React.Dispatch<React.SetStateAction<RscPayload>>;
}>({
  setRscPayload: () => {},
});

export default RouteContext;
