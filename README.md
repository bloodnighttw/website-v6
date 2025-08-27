# A minimal setup to reproduce the issue

## How to reproduce

1. Clone the repository **with this branch(vite-issue-minimal)**
2. Install dependencies (Don't forget to ``rm -rf **/node_modules`` if there has any)
3. Start the development server ``pnpm dev``, you can run this in root, the first try
 may fail since some internal package hasn't been built yet.
4. Open the application in your browser with any pathname (e.g. /ouo, /test, /wtf)

## How not to reproduce

1. add ``nodeLinker: hoisted`` in the end of ``pnpm-workspace.yaml``
2. ``rm -rf **/node_modules`` to clean up any existing node_modules/
3. ``pnpm install`` to install all monorepo packages
4. Start the development server ``pnpm dev``, you can run this in root, the first try may have some error
 since some internal package hasn't been built yet.
5. Open the application in your browser with any pathname (e.g. /ouo, /test, /wtf)
6. You can see that there are no errors in the console and no issues with the application.

Another way to fix the issue is to install @vitejs/plugin-rsc in the root package.json file.

## Structure

I use tsdown to build internal packages.
the internal packages are located in the `packages/rpress` directory.
Which are based on official ssg example.

the vite plugin used in application is under `packages/rpress/vite-plugin-rsc/src/framework/vite/index.ts`.
