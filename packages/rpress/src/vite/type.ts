export interface RPressConfig {
  routesDir: string;
  strictMode: boolean;
  prefetchStrategy: "hover" | "viewport" | "eager" | "none";
  imgBaseURL: string;
}
