import "@/global.css";
import "./root.css";
import "server-only";
import Navbar from "./navbar";
import loadTheme from "@/utils/theme/loadtheme";
import type { Lang } from "@/utils/i18n/config";
import { I18nProvider } from "@/utils/i18n/provider";

interface RootProps {
  children: React.ReactNode;
  lang: Lang;
}

const translations: Record<string, () => Promise<{ default: unknown }>> = {
  zh: () => import("@/config/i18n/zh.json"),
  en: () => import("@/config/i18n/en.json"),
};

export default async function RootLayout(props: RootProps) {
  const resources = await translations[props.lang]();

  return (
    <html lang={props.lang} suppressHydrationWarning={true}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="relative">
        <script>{`(${loadTheme.toString()})()`}</script>
        <I18nProvider
          lang={props.lang}
          resources={resources.default as Record<string, unknown>}
        >
          <div className="absolute w-full h-screen overflow-y-auto bg-primary-50/40 dark:bg-primary-900/40">
            <Navbar lang={props.lang} />
            <div className="container mt-8">{props.children}</div>
          </div>
          <div className="gridient-bg absolute -z-1" />
        </I18nProvider>
      </body>
    </html>
  );
}
