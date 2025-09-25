import presetWind4 from "@unocss/preset-wind4";

import { defineConfig, extractorSplit, transformerDirectives } from "unocss";

const modifiedWind4 = () => {
  const preset = presetWind4();
  console.log(preset.theme?.colors);

  return {
    ...preset,
    theme: {
      ...preset.theme,
      colors: {
        primary: {
          ...((preset.theme?.colors as Record<string, unknown>)["zinc"] ?? {}),
        },
        secondary: {
          ...((preset.theme?.colors as Record<string, unknown>)["blue"] ?? {}),
        },
        accent: {
          ...((preset.theme?.colors as Record<string, unknown>)["rose"] ?? {}),
        },
        neutral: {
          ...((preset.theme?.colors as Record<string, unknown>)["gray"] ?? {}),
        },
        "base-100": "#FFFFFF",
        info: {
          ...((preset.theme?.colors as Record<string, unknown>)["sky"] ?? {}),
        },
        success: {
          ...((preset.theme?.colors as Record<string, unknown>)["green"] ?? {}),
        },
        warning: {
          ...((preset.theme?.colors as Record<string, unknown>)["yellow"] ??
            {}),
        },
        error: {
          ...((preset.theme?.colors as Record<string, unknown>)["red"] ?? {}),
        },
      },
    },
  };
};

export default defineConfig({
  transformers: [
    transformerDirectives({
      applyVariable: ["--uno"],
    }),
  ],
  presets: [modifiedWind4()],
});
