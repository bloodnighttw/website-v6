"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { fallbackLang } from "./config";

i18next.use(initReactI18next).init({
  fallbackLng: fallbackLang,
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
