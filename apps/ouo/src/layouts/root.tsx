import "@/global.css";
import "./root.css";
import "server-only";
import Navbar from "./navbar";
import loadTheme from "@/utils/theme/loadtheme";
import type { Lang } from "@/utils/i18n/config";
import { I18nProvider } from "@/utils/i18n/provider";
import * as stylex from "@stylexjs/stylex";
import { spacing } from "@/styles/tokens.stylex";
import { styles as globalStyles } from "@/styles/styles";
import { DevStyleXInject } from "@/components/dev-stylex-inject";

const styles = stylex.create({
  gradientBg: {
    position: "fixed",
    zIndex: -10,
    top: 0,
  },
  container: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
});

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
        <DevStyleXInject cssHref="/stylex.css" />
      </head>
      <body>
        <script>{`(${loadTheme.toString()})()`}</script>
        <I18nProvider
          lang={props.lang}
          resources={resources.default as Record<string, unknown>}
        >
          <div {...stylex.props(globalStyles.gradientBg, styles.gradientBg)} />
          <Navbar lang={props.lang} />
          <div {...stylex.props(globalStyles.container, styles.container)}>
            {props.children}
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
