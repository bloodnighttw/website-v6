let config = {
  prefetchStrategy: "hover" as const,
};

export const setConfig = (newConfig: typeof config) => {
  config = newConfig;
};

export default config;
