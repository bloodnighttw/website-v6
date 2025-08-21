import { Counter } from './counter'

export async function Root({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>RSC MDX SSG</title>
      </head>
      <body>
        <header style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1>
            <a href="/">RSC + MDX + SSG</a>
          </h1>
          <Counter />
          <span data-testid="timestamp">
            Rendered at {new Date().toISOString()}
          </span>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
