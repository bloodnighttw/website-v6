export interface RPressConfig {
  routesDir: string;
  strictMode: boolean;
  prefetchStrategy: "hover" | "viewport" | "eager" | "none";
}

export const defaultConfig: RPressConfig = {
  routesDir: "src/routes/**",
  strictMode: true,
  prefetchStrategy: "hover",
};

export default function defineConfig(
  config: Partial<RPressConfig> = {},
): RPressConfig {
  return {
    ...defaultConfig,
    ...config,
  };
}
