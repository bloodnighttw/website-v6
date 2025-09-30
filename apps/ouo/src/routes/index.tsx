import { createRoute } from "rpress/route";
import RootLayout from "./layouts/root";
import { FlatComponentHelper } from "rpress/helper";
import "server-only";

export const route = createRoute("/");

export default async function Index() {
  const helper = new FlatComponentHelper();
  helper.add(RootLayout, {});
  const Flatten = helper.flatten();

  return (
    <Flatten>
      <h1 className="text-4xl font-bold mb-4">Welcome to My Website!</h1>
      <p className="text-lg mb-8">
        this is a minimal setup of my website, with my custom React Server
        Component Server Side Generation Framework, which Powered by
        @vitejs/plugin-rsc .
      </p>
      <p className="text-lg">
        The site is still under construction, please come back later.
      </p>
    </Flatten>
  );
}
