"use client";

import fetchrsc from "../utils/prefetch-rsc";

export default function Link() {
  return (
    <a
      href="/fr"
      onMouseEnter={() => {
        fetchrsc.preload("/fr.rsc");
      }}
    >
      Link
    </a>
  );
}
