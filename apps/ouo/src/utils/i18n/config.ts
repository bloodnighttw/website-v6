export const lang = ["en", "zh"] as const;

export type Lang = (typeof lang)[number];

export const defaultLang: Lang = "en";

export const fallbackLang: Lang = "en";
