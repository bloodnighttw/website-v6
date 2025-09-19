import createRoute, { type RouterProps } from "rpress/route";

export const route = createRoute("/ouo/:...other", {
  generator: async () => {
    return [
      {
        other: ["a", "b", "c"],
      },
    ];
  },
});

type Props = RouterProps<typeof route>;

export default async function OuoLayout({ params }: Props) {
  return <div>hello, {params.other.join("/")}</div>;
}
