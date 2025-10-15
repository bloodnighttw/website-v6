"use client";

import { createContext, use, type ReactNode } from "react";

const lang = ["en", "zh"] as const;

export type Lang = (typeof lang)[number];
type Translate = typeof import("@/config/i18n/zh.json");

interface I18nContextType {
  lang: Lang;
  translate: Translate;
}

const I18nContext = createContext<I18nContextType | null>(null);

export { I18nContext };

const translations: Record<Lang, () => Promise<Translate>> = {
  zh: () => import("@/config/i18n/zh.json"),
  en: () => import("@/config/i18n/en.json"),
};

export default function I18nProvider({
  children,
  lang,
}: {
  children: ReactNode;
  lang: Lang;
}) {
  const translate = use(translations[lang]());
  return (
    <I18nContext.Provider value={{ lang, translate }}>
      {children}
    </I18nContext.Provider>
  );
}
