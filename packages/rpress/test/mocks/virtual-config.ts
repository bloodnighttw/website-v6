let config = {
  prefetchStrategy: "hover" as const,
  imgBaseURL: "img",
};

export const setConfig = (newConfig: typeof config) => {
  config = newConfig;
};

export default config;
