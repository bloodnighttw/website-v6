import type { Lang, Translate } from "@/contexts/i18n";
import I18nProvider from "@/contexts/i18n";
import type { ReactNode } from "react";
import "server-only";

const translations: Record<string, () => Promise<{ default: Translate }>> = {
  zh: () => import("@/config/i18n/zh.json"),
  en: () => import("@/config/i18n/en.json"),
};

export async function I18nServerProvider(props: {
  lang: Lang;
  children: ReactNode;
}) {
  const translate = await translations[props.lang]();
  console.log(translate);
  // return { lang, translate };
  return (
    <I18nProvider lang={props.lang} translate={{}}>
      {props.children}
    </I18nProvider>
  );
}
