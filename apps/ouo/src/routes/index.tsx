import { createRoute, type RouterProps } from "rpress";
import { Counter } from "../counter";

export const config = createRoute("/:lang", {
  generator: async () => {
    return [{ lang: "en" }, { lang: "fr" }, { lang: "es" }];
  },
});

export default async function WTF(props: RouterProps<typeof config>) {
  return (
    <>
      <div>hi from /:lang</div>
      <div>props</div>
      <div>data: {JSON.stringify(props.params)}</div>
      <Counter />
    </>
  );
}
