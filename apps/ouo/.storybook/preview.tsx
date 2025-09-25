import type { Preview } from "@storybook/react-vite";
import { useLayoutEffect } from "react";

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
      const theme = context.globals.theme || ("light" as "light" | "dark");

      useLayoutEffect(() => {
        if (theme === "dark") {
          document.documentElement.classList.add("dark", "bg-zinc-600");
          // find parent element with class "docs-story" and add class "dark" to it
          const docsStory = document.querySelectorAll(".docs-story");
          if (docsStory) {
            docsStory.forEach((e) => e.classList.add("dark", "bg-zinc-600"));
          }

          return () => {
            document.documentElement.classList.remove("dark", "bg-zinc-600");
            if (docsStory) {
              docsStory.forEach((e) =>
                e.classList.remove("dark", "bg-zinc-600"),
              );
            }
          };
        }
      }, [theme]);

      return <Story />;
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
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
  },
};

export default preview;
