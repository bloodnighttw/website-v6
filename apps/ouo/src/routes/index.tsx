import { createRoute, type RouterProps } from "rpress";
import RootLayout from "./layouts/root";
import { FlatComponentHelper } from "rpress/helper";
import ClientLz from "./layouts/counter.lz";
import Link from "rpress/link";

export const route = createRoute("/");

export default async function WTF(props: RouterProps<typeof route>) {
  const helper = new FlatComponentHelper();
  helper.add(RootLayout, {});
  const Flatten = helper.flatten();

  return (
    <Flatten>
      <div>hi from home</div>
      <div>props</div>
      <div>data: {JSON.stringify(props.params)}</div>
      <ClientLz />
      <Link to="/fr">to fr</Link>
      <div style={{ height: 1200 }} />
      <Link to="/en" prefetch="viewport">
        to en
      </Link>
    </Flatten>
  );
}
