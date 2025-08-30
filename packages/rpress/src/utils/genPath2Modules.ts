// get static

import type { RouteModule } from "../core/route";
import { normalize } from "./path";


// generate static paths to route modules
// the paths are normalized to ensure consistency
export async function generateStaticPaths(all: RouteModule[], supressErrors: boolean = false) {

  const mapping: Record<string, RouteModule> = {};

  const addModule = async (module: RouteModule) => {
    const generator = module.route.config.generator;
    const matcher = module.route.matcher;

    if(matcher.hasParams() === false) {
      mapping[normalize(matcher.toString())] = module;
    }

    const staticPaths = await generator();
    const result = staticPaths.map((staticPath) => {
      return normalize(matcher.toString(staticPath));
    });

    result.forEach((path) => {
      if (!mapping[path]) {
        mapping[path] = module;
      } else if(!supressErrors) {
        throw new Error(`Duplicate static path found: ${path}`);
      } else {
        console.warn(`[vite-rsc] Duplicate static path found: ${path}, supressing due to supressErrors=true`);
      }
    });
  }

  await Promise.all(all.map((module) => addModule(module)));

  return mapping;
}
