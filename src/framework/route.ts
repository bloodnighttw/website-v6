import routes from './entry/shared/route'
import { normalize } from './entry/shared/path'

export interface RouteConfig {
  title: string
  description: string
  keywords: string[]
}

export interface RouteProps {
  path: {[key: string]: string} | string
}

export interface RouteModule {
  default: React.ComponentType<RouteProps>
  config?: () => Promise<Partial<RouteConfig>>
}

interface Route {
  [path:string]: RouteModule
}

export type Routes = Promise<Route>[] | Route

type Path = string | string[];

// route(path,routeFile) or route(gen,routeFile)
function isFunction(path: Path | (() => Path)): path is (()=>Path) {
  return typeof path === 'function';
}

function isArray(path: Path | string): path is string[] {
  return Array.isArray(path);
}

export async function route(path: Path | (()=>Path), filePath: string ): Promise<Route> {

  const paths = isFunction(path) ? path() : path;
  const realFilePath = `/src/routes/${filePath}`

  if(!(realFilePath in routes)){
    console.error("Route file not found:", realFilePath);
    throw new Error(`Route file not found: ${realFilePath}`);
  }
  const routeModulePromise = routes[realFilePath];
  const routeModule = await routeModulePromise;

  const route: Route = {};

  if(isArray(paths)) {
    for(const p of paths) {
      route[normalize(p)] = routeModule;
    }
  } else {
    route[normalize(paths)] = routeModule;
  }

  return route;
}