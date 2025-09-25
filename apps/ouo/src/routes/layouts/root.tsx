import "../../global.css";

interface RootProps {
  children: React.ReactNode;
  lang: string;
}

const changeTheme = () => {
  const theme = localStorage.getItem("theme");
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  }

  // if theme is not set, use system preference
  if (!theme) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  }
};

export default function RootLayout(props: Partial<RootProps>) {
  return (
    <html lang={props.lang || "en"} suppressHydrationWarning={true}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script>{`(${changeTheme.toString()})()`}</script>
      </head>
      <body className="bg-primary">{props.children}</body>
    </html>
  );
}
