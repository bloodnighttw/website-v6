import { Counter } from "../counter"
import { createRoute } from "../framework/routeV2";

export default async function Index({path} : {path: string}){
    return <>
        <div>hi from {path}</div>
        <Counter />
    </>
}

export const config = createRoute("/:lang", {
  generator: async () => {

    
    return {
        lang: "en"
    };
  },
});