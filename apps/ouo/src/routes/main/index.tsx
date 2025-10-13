import { createRoute } from "rpress/route";
import RootLayout from "@/layouts/root";
import { FlatComponentHelper } from "rpress/helper";
import "server-only";
import About from "./about";
import Project from "./project";
import Info from "./info";
import projectSource from "@/utils/source";
import all from "virtual:source:pj";

console.log(all);

export const route = createRoute("/");

export default async function Index() {
  const helper = new FlatComponentHelper();
  helper.add(RootLayout, {});
  const Flatten = helper.flatten();
  console.log(projectSource);

  return (
    <Flatten>
      <About />
      <Project />
      <Info />
    </Flatten>
  );
}
