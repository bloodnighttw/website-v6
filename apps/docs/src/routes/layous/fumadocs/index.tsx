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

interface Props {
  page: Page;
  slug: string[];
}

export default async function FumaDocs({ page, slug }: Props) {
  const { source } = await import("@/lib/source");

  if (!page) {
    throw new Error("Page not found");
  }

  const MDX = page.data.body;

  return (
    <html suppressHydrationWarning={true}>
      <body>
        <title>{page.data.title}</title>
        <Provider slug={slug}>
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
