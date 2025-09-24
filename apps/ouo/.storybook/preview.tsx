import type { Preview } from "@storybook/react-vite";
import { createContext, useContext } from "react";
import "virtual:uno.css";

const ThemeContext = createContext<{ theme: "light" | "dark" }>({
  theme: "light",
});

export const useTheme = () => useContext(ThemeContext);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },

  decorators: [
    (Story, context) => {
      const theme =
        context.globals.theme || ("both" as "light" | "dark" | "both");

      // Update Storybook background
      context.parameters.backgrounds = {
        ...context.parameters.backgrounds,
        default: theme,
      };

      if (theme === "dark")
        return (
          <div className="dark bg-zinc-500 p-2 min-w-2xl justify-center items-center flex">
            <Story />
          </div>
        );

      if (theme === "light")
        return (
          <div>
            <Story />
          </div>
        );

      return (
        <div className="flex flex-col gap-4">
          <div className="dark bg-zinc-500 p-2 min-w-2xl justify-center items-center flex">
            <Story />
          </div>
          <div>
            <Story />
          </div>
        </div>
      );
    },
  ],

  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "both", title: "Both" },
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
  },
};

export default preview;
