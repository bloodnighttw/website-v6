import { createRoute, type RouterProps } from "rpress/route";
import RootLayout from "@/layouts/root";
import { FlatComponentHelper } from "rpress/helper";
import "server-only";
import type { Lang } from "@/utils/i18n/config";
import { source } from "@/utils/source";

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

  return (
    <Flatten>
      <DyComponent />
      <pre className="bg-accent-100/20 p-4">
        <code>{JSON.stringify(dyComponent.zod, null, 2)}</code>
      </pre>
    </Flatten>
  );
}
