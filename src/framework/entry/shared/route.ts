import type { RouteModule } from "../../route";

const routes = import.meta.glob("/src/routes/**", {eager:true}) as Record<string, Promise<RouteModule>>;

export default routes;