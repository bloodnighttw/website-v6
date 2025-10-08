import { createRoute, type RouterProps } from "rpress/route";
import RootLayout from "@/layouts/root";
import { FlatComponentHelper } from "rpress/helper";
import "server-only";
import projectSource from "@/utils/source";

export const route = createRoute("/:lang/projects/:pj", {
  generator: async () => {
    console.log("Generating routes for /:lang", projectSource.entries());
    const routes = [] as { lang: string; pj: string }[];
    for (const entry of projectSource.entries()) {
      const pj = entry;
      routes.push({ lang: "en", pj: pj[0] });
      routes.push({ lang: "zh", pj: pj[0] });
    }

    return routes;
  },
});

export default async function Index(props: RouterProps<typeof route>) {
  const helper = new FlatComponentHelper();
  helper.add(RootLayout, {});
  const Flatten = helper.flatten();
  const [dyComponent] = await projectSource.search(
    [props.params.pj],
    props.params.lang,
  );
  console.log(dyComponent);
  const DyComponent = dyComponent.default;

  return (
    <Flatten>
      <DyComponent />
    </Flatten>
  );
}
