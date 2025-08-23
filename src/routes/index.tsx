import { Counter } from "../counter"
import { createRoute, type RouterProps } from "../framework/routeV2";
import type { InferPathParams } from "../framework/utils/path2regexp";
import { Root } from "./layouts/root";

export const config = createRoute("/:lang", {
  generator: async () => {
    return [{
      lang: "en",
    }] satisfies InferPathParams<"/:lang">[];
  },
});

export default async function Index({params} : RouterProps<typeof config>){
  
    return <>
      <Root>
        <div>hi from /:lang</div>
        <div>props</div>
        <div>{JSON.stringify(params)}</div>
        <Counter />
      </Root>
    </>
}
