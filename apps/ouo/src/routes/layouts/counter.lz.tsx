"use client";

import dynamic from "rpress/dynamic";

export default dynamic(() => import("../../counter"), {
  ssr: false,
  loading: <div>Loading...</div>,
});