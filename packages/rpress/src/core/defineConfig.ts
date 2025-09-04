export interface RPressConfig {
  routesDir: string;
}

export default function defineConfig(
  config: Partial<RPressConfig> = {},
): RPressConfig {
  
  return {
    routesDir: "src/routes/**",
    ...config,
  };
}