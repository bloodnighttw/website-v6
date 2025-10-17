import { createRoute, type RouterProps } from "rpress/route";
import RootLayout from "@/layouts/root";
import { FlatComponentHelper } from "rpress/helper";
import "server-only";
import About from "./about";
import Project from "./project";
import Info from "./info";
import type { Lang } from "@/utils/i18n/config";

export const route = createRoute("/:lang", {
  generator: async () => {
    return [{ lang: "en" }, { lang: "zh" }];
  },
});

export default async function Index(props: RouterProps<typeof route>) {
  const helper = new FlatComponentHelper();
  helper.add(RootLayout, { lang: props.params.lang as Lang });
  const Flatten = helper.flatten();

  return (
    <Flatten>
      <About />
      <Project lang={props.params.lang as Lang} />
      <Info />
    </Flatten>
  );
}
