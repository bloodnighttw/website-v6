"use client";

import { createContext, type ReactNode } from "react";

const lang = ["en", "zh"] as const;

const I18nContext = createContext<(typeof lang)[number]>("en");

export type Lang = (typeof lang)[number];

export { I18nContext };

export default function I18nProvider({
  children,
  lang,
}: {
  children: ReactNode;
  lang: Lang;
}) {
  return <I18nContext.Provider value={lang}>{children}</I18nContext.Provider>;
}
