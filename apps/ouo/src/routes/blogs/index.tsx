import { createRoute, type RouterProps } from "rpress/route";
import RootLayout from "@/layouts/root";
import { FlatComponentHelper } from "rpress/helper";
import "server-only";
import type { Lang } from "@/utils/i18n/config";
import { blogSource } from "@/utils/source";
import Meta from "./meta";

export const route = createRoute("/:lang/blog/:slug", {
  generator: async () => {
    const routes = [] as { lang: string; slug: string }[];
    const slugs = blogSource.getSlugs();

    for (const slug of slugs) {
      routes.push({ lang: "en", slug });
      routes.push({ lang: "zh", slug });
    }

    return routes;
  },
});

export default async function Index(props: RouterProps<typeof route>) {
  const helper = new FlatComponentHelper();
  helper.add(RootLayout, { lang: props.params.lang as Lang });
  const Flatten = helper.flatten();

  const [dyComponent, isExactMatch] = await blogSource.search(
    [props.params.slug],
    props.params.lang,
  );

  const DyComponent = dyComponent.default;
  const metadata = dyComponent.zod;

  return (
    <Flatten>
      <title>{metadata.title}</title>
      <meta name="title" content={metadata.title} />
      <meta name="description" content={metadata.description} />

      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content={metadata.date} />
      {/* for preview image */}
      <meta
        property="og:image"
        content={dyComponent.preview || "/default.png"}
      />
      <meta property="og:image:alt" content={metadata.title} />
      <meta property="og:image:type" content="image/png" />

      {/*For twitter*/}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
      <meta
        name="twitter:image"
        content={dyComponent.preview || "/default.png"}
      />

      <Meta
        metadata={metadata}
        lang={props.params.lang as Lang}
        isExactMatch={isExactMatch}
      />

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <DyComponent />
      </div>
    </Flatten>
  );
}
