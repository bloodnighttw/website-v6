import createRoute from "rpress/route";

export const route = createRoute("/ouo/:...other/aa", {
  generator: async () => {
    return [{ other: [] }, { other: ["path", "to", "resource"] }];
  },
});

export default async function OuoLayout({
  params,
}: {
  params: { other: string[] };
}) {
  return (
    <div>
      Ouo Layout - Other Path:{" "}
      {params.other.length > 0 ? params.other.join("/") : "(root)"}
    </div>
  );
}
