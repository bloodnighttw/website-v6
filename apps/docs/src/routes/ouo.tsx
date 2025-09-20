import createRoute, { type RouterProps } from "rpress/route";
import FumaDocs from "./layous/fumadocs";

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

  return <FumaDocs page={page} slug={slug} />;
}
