interface RootProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export default function RootLayout(props: Partial<RootProps>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {props.title && <title>{props.title}</title>}
        {props.description && <meta name="description" content={props.description} />}
      </head>
      <body>{props.children}</body>
    </html>
  );
}
