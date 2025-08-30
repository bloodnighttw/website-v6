import { createRoute, type RouterProps } from "rpress";
import { Counter } from "../counter";
import RootLayout from "./layouts/root";
import { FlatComponentHelper } from "rpress/helper";

export const route = createRoute("/", {
  generator: async () => {
    return [];
  },
});

export default async function WTF(props: RouterProps<typeof route>) {

  const helper = new FlatComponentHelper();
  helper.expand(RootLayout, {});
  const Flatten = helper.flatten();

  return (
    <Flatten>
      <div>hi from /:lang</div>
      <div>props</div>
      <div>data: {JSON.stringify(props.params)}</div>
      <Counter />
    </Flatten>
  );
}
