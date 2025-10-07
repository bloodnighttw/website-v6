import "@/global.css";
import "./root.css";
import "server-only";
import Navbar from "./navbar";
import loadTheme from "@/utils/theme/loadtheme";

interface RootProps {
  children: React.ReactNode;
  lang: string;
}

export default function RootLayout(props: Partial<RootProps>) {
  return (
    <html lang={props.lang || "en"} suppressHydrationWarning={true}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="relative">
        <script>{`(${loadTheme.toString()})()`}</script>
        <div className="absolute w-full h-screen overflow-y-auto bg-primary-50/40 dark:bg-primary-900/40">
          <Navbar />
          <div className="container mt-8">{props.children}</div>
        </div>
        <div className="gridient-bg absolute -z-1" />
      </body>
    </html>
  );
}
