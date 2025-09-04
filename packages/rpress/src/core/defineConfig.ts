export interface RPressConfig {
  routesDir: string;
  strictMode: boolean;
}

export default function defineConfig(
  config: Partial<RPressConfig> = {},
): RPressConfig {
  
  return {
    routesDir: "src/routes/**",
    strictMode: true,
    ...config,
  };
}
