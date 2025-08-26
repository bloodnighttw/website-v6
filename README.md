# Website-v6

## Packages

This monorepo contains several packages and an application. Brief summary:

- ``apps/ouo``: A Vite + React Server Components application — the demo blog app and entrypoint for local development.
- ``packages/rpress``: The core framework utilities used by the app. It contains server / client entry points, SSR/RSC helpers, and routing utilities (see `src/framework`). There's also tests under `test`.
  1. ``src/framework/vite/index.ts`` is the vite plugin used by other packages, and it is based on `@vitejs/plugin-rsc` and config to where entry script located.
  2. ``src/framework/entry/*`` contain entry points for the server and client need by vite-rsc, shared logic is under ``src/framework/entry/shared/*``
- ``packages/eslint``: Shared ESLint configuration used across the workspace.

## How to run

```bash
pnpm install
pnpm dev
```

then open `http://localhost:5173/hello` in your browser, the content should be displayed.
