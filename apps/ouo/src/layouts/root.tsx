import "@/global.css";
import "./root.css";
import "server-only";
import Navbar from "./navbar";
import loadTheme from "@/utils/theme/loadtheme";
import type { Lang } from "@/contexts/i18n";
import { I18nServerProvider } from "./i18n.server";

interface RootProps {
  children: React.ReactNode;
  lang: Lang;
}

export default function RootLayout(props: RootProps) {
  return (
    <html lang={props.lang} suppressHydrationWarning={true}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="relative">
        <script>{`(${loadTheme.toString()})()`}</script>
        <I18nServerProvider lang={props.lang}>
          <div className="absolute w-full h-screen overflow-y-auto bg-primary-50/40 dark:bg-primary-900/40">
            <Navbar />
            <div className="container mt-8">{props.children}</div>
          </div>
          <div className="gridient-bg absolute -z-1" />
        </I18nServerProvider>
      </body>
    </html>
  );
}
