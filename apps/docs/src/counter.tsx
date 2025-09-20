"use client";

import React from "react";
import NoSSR from "rpress/nossr";

export default function Counter() {
  const [count, setCount] = React.useState(
    typeof window !== "undefined" ? 0 : -1,
  );

  return (
    <NoSSR fallback={<div>Loading...</div>}>
      <button type="button" onClick={() => setCount((c) => c + 1)}>
        Count is {count}
      </button>
    </NoSSR>
  );
}
