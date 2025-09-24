import { addons } from "@storybook/manager-api";
import { themes } from "@storybook/theming";

// Set initial theme to light (matching component default)
addons.setConfig({
  theme: themes.light,
});
