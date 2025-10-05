import { createRoute } from "rpress/route";
import RootLayout from "@/layouts/root";
import { FlatComponentHelper } from "rpress/helper";
import "server-only";
import About from "./about";
import Project from "./project";

export const route = createRoute("/");

export default async function Index() {
  const helper = new FlatComponentHelper();
  helper.add(RootLayout, {});
  const Flatten = helper.flatten();

  return (
    <Flatten>
      <About />
      <Project />
    </Flatten>
  );
}
