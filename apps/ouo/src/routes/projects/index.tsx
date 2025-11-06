import { createRoute, type RouterProps } from "rpress/route";
import RootLayout from "@/layouts/root";
import { FlatComponentHelper } from "rpress/helper";
import "server-only";
import type { Lang } from "@/utils/i18n/config";
import { pjSource } from "@/utils/source";
import Demo from "./demo";
import Meta from "./meta";

export const route = createRoute("/:lang/projects/:slug", {
  generator: async () => {
    const routes = [] as { lang: string; slug: string }[];
    const slugs = pjSource.getSlugs();

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

  const [dyComponent] = await pjSource.search(
    [props.params.slug],
    props.params.lang,
  );

  const DyComponent = dyComponent.default;
  const metadata = dyComponent.zod;

  return (
    <Flatten>
      <Meta metadata={metadata} lang={props.params.lang as Lang} />
      <Demo demo={metadata.demo} lang={props.params.lang as Lang} />

      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <DyComponent />
      </div>
    </Flatten>
  );
}
