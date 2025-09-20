import createRoute, { type RouterProps } from "rpress/route";
// require rolldown vite to build this project.
// if we don't have rolldown vite, the dev and prod won't be the same.
// and cause no file generated.
// import { source } from "../lib/source";
import defaultMdxComponents from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { RootProvider } from "fumadocs-ui/provider/base";
import Provider from "./layous/fumadocs/framework";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

export const route = createRoute("/docs/:...other", {
  generator: async () => {
    // return [{
    //   other: []
    // }];
    const { source } = await import("../lib/source");
    const slugs = source
      .getPages()
      .map((page) => page.slugs)
      .map((d) => ({ other: d }));

    console.log("Generated slugs:", slugs);

    return slugs;
  },
});

type Props = RouterProps<typeof route>;

export default async function OuoLayout({ params }: Props) {
  const slug = params.other;

  const { source } = await import("../lib/source");
  const page = source.getPage(slug);

  if (!page) {
    // ...
    throw new Error("Page not found");
  }

  const MDX = page.data.body;
  return (
    // <div>wtf</div>
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
