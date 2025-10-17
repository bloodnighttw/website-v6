"use client";

import { I18nextProvider } from "react-i18next";
import { type ReactNode, useEffect, useState } from "react";
import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { fallbackLang } from "./config";

export function I18nProvider(props: {
  lang: string;
  resources: Record<string, unknown>;
  children: ReactNode;
}) {
  const [i18n] = useState(() => {
    const instance = createInstance();
    instance.use(initReactI18next).init({
      lng: props.lang,
      fallbackLng: fallbackLang,
      resources: {
        [props.lang]: {
          translation: props.resources,
        },
      },
      interpolation: {
        escapeValue: false,
      },
    });
    return instance;
  });

  useEffect(() => {
    if (i18n.language !== props.lang) {
      i18n.changeLanguage(props.lang);
      i18n.addResourceBundle(props.lang, "translation", props.resources);
    }
  }, [props.lang, props.resources, i18n]);

  return <I18nextProvider i18n={i18n}>{props.children}</I18nextProvider>;
}
