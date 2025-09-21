import defaultMdxComponents from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { RootProvider } from "fumadocs-ui/provider/base";
import Provider from "./framework";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { Page } from "@/lib/source";
import { File, Folder, Files } from "fumadocs-ui/components/files";

import "@/global.css";

interface Props {
  page: Page;
  pathname: string;
  params?: Record<string, string>;
}

export default async function FumaDocs({ page, pathname, params }: Props) {
  const { source } = await import("@/lib/source");

  if (!page) {
    throw new Error("Page not found");
  }

  const MDX = page.data.body;

  return (
    <html suppressHydrationWarning={true}>
      <body>
        <title>{page.data.title}</title>
        <Provider params={params} pathname={pathname}>
          <RootProvider
            theme={{ enabled: true, defaultTheme: "system" }}
            search={{ enabled: false }}
          >
            <DocsLayout
              sidebar={{
                collapsible: false,
              }}
              nav={{
                title: <div>2ts</div>,
              }}
              tree={source.getPageTree()}
            >
              <DocsPage toc={page.data.toc}>
                <DocsTitle>{page.data.title}</DocsTitle>
                <DocsDescription>{page.data.description}</DocsDescription>
                <DocsBody>
                  <MDX
                    components={{
                      ...defaultMdxComponents,
                      File,
                      Folder,
                      Files,
                    }}
                  />
                </DocsBody>
              </DocsPage>
            </DocsLayout>
          </RootProvider>
        </Provider>
      </body>
    </html>
  );
}
