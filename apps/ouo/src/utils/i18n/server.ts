import "server-only";
import type { Lang } from "./config";

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

  return function t(key: string): string {
    const keys = key.split(".");
    let value: unknown = resources;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };
}
