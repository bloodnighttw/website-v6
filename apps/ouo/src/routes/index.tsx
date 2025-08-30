import { createRoute, type RouterProps } from "rpress";
import RootLayout from "./layouts/root";
import { FlatComponentHelper } from "rpress/helper";
import noSSR from "rpress/dynamic";

export const route = createRoute("/");

const T = noSSR(() => import("../counter"));

export default async function WTF(props: RouterProps<typeof route>) {
  const helper = new FlatComponentHelper();
  helper.expand(RootLayout, {});
  const Flatten = helper.flatten();

  return (
    <Flatten>
      <div>hi from /:lang</div>
      <div>props</div>
      <div>data: {JSON.stringify(props.params)}</div>
      <T />
    </Flatten>
  );
}
