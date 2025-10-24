import { createRoute, type RouterProps } from "rpress/route";
import RootLayout from "@/layouts/root";
import { FlatComponentHelper } from "rpress/helper";
import "server-only";
import type { Lang } from "@/utils/i18n/config";
import { source } from "@/utils/source";
import Demo from "./demo";
import Meta from "./meta";

export const route = createRoute("/:lang/projects/:pj", {
  generator: async () => {
    console.log("Generating routes for /:lang", source.entries());
    const routes = [] as { lang: string; pj: string }[];
    for (const entry of source.entries()) {
      const pj = entry;
      routes.push({ lang: "en", pj: pj[0] });
      routes.push({ lang: "zh", pj: pj[0] });
    }

    return routes;
  },
});

export default async function Index(props: RouterProps<typeof route>) {
  const helper = new FlatComponentHelper();
  helper.add(RootLayout, { lang: props.params.lang as Lang });
  const Flatten = helper.flatten();
  const [dyComponent] = await source.search(
    [props.params.pj],
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
