import "virtual:uno.css";

interface RootProps {
  children: React.ReactNode;
  lang: string;
}

export default function RootLayout(props: Partial<RootProps>) {
  return (
    <html lang={props.lang || "en"}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script>
          {/* set up .dark when dark mode is enable */}
          {`if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }`}
        </script>
      </head>
      <body>{props.children}</body>
    </html>
  );
}
