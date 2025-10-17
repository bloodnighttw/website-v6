"use client";

import { I18nextProvider } from "react-i18next";
import type { ReactNode } from "react";
import i18next from "@/utils/i18n/client";

export type { Lang } from "@/utils/i18n/config";

export default function I18nClientProvider({
  children,
  lang,
  resources,
}: {
  children: ReactNode;
  lang: string;
  resources: Record<string, unknown>;
}) {
  if (!i18next.isInitialized || i18next.language !== lang) {
    i18next.init({
      lng: lang,
      resources: {
        [lang]: {
          translation: resources,
        },
      },
    });
  }

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
