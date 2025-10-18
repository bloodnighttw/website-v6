import "server-only";
import { createInstance } from "i18next";
import type { Lang } from "./config";
import { fallbackLang } from "./config";

const translations: Record<
  string,
  () => Promise<{ default: Record<string, unknown> }>
> = {
  zh: () => import("@/config/i18n/zh.json"),
  en: () => import("@/config/i18n/en.json"),
};

export async function getTranslations(lang: Lang) {
  const resources = await translations[lang]();
  return resources.default;
}

export async function createTranslate(lang: Lang) {
  const resources = await getTranslations(lang);

  const i18n = createInstance();
  await i18n.init({
    lng: lang,
    fallbackLng: fallbackLang,
    resources: {
      [lang]: {
        translation: resources,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

  return i18n.t.bind(i18n);
}
