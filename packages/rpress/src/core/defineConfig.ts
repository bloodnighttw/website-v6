export interface RPressConfig {
  routesDir: string;
  strictMode: boolean;
  prefetchStrategy?: "hover" | "viewport" | "eager" | "none";
}

export default function defineConfig(
  config: Partial<RPressConfig> = {},
): RPressConfig {
  return {
    routesDir: "src/routes/**",
    strictMode: true,
    prefetchStrategy: "hover",
    ...config,
  };
}
