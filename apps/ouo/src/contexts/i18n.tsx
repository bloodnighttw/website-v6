"use client";

import { createContext, type ReactNode } from "react";

const lang = ["en", "zh"] as const;

export type Lang = (typeof lang)[number];
export type Translate = typeof import("@/config/i18n/zh.json");

interface I18nContextType {
  lang: Lang;
  translate: Translate;
}

const I18nContext = createContext<I18nContextType | null>(null);

export { I18nContext };

export default function I18nProvider({
  children,
  lang,
  translate,
}: {
  children: ReactNode;
  lang: Lang;
  translate: Translate;
}) {
  return (
    <I18nContext.Provider value={{ lang, translate }}>
      {children}
    </I18nContext.Provider>
  );
}
