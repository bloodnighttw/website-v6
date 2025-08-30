"use client";

import React from "react";

export default function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <button type="button" onClick={() => setCount((c) => c + 1)}>
      Count is {count}
    </button>
  );
}
