import { createRoute, type RouterProps } from "rpress";

export const route = createRoute("/:lang", {
  generator: async () => {
    return [{ lang: "en" }, { lang: "fr" }];
  },
});

export default async function LangLayout({
  params,
}: RouterProps<typeof route>) {
  return <div>Current language: {params.lang}</div>;
}
