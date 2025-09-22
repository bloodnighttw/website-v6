import { createRoute, type RouterProps } from "rpress/route";
import RootLayout from "./layouts/root";
import { FlatComponentHelper } from "rpress/helper";
import Link from "rpress/link";
import Image from "rpress/image";
import Counter from "../counter";

export const route = createRoute("/");

export default async function WTF(props: RouterProps<typeof route>) {
  const helper = new FlatComponentHelper();
  helper.add(RootLayout, {});
  const Flatten = helper.flatten();

  return (
    <Flatten>
      <div className="dark:bg-amber-200">hi from home</div>
      <div>props</div>
      <div>data: {JSON.stringify(props.params)}</div>
      <Counter />
      <Link to="/fr">to fr</Link>
      <div style={{ height: 1200 }} />
      <Link to="/en" prefetch="viewport">
        to en
      </Link>
      <Image
        src="https://r2.bntw.dev/NqhBNru.jpeg"
        alt="logo"
        width={100}
        height={100}
      />
    </Flatten>
  );
}
