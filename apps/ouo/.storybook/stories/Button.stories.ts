import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn, expect, within } from "storybook/test";

import { Button } from "@/components/button";

const meta = {
  title: "Component/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    varient: {
      control: "radio",
      options: ["primary", "secondary", "outline"],
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    onClick: fn(),
    children: "Button",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const button = canvasElement.querySelector("button");
    if (button) {
      // Test that button is enabled and clickable
      expect(button.disabled).toBe(false);
      // click the button
      button.click();
    }
    if (args.onClick) {
      expect(args.onClick).toHaveBeenCalled();
    }
  },
};

export const Primary: Story = {
  args: {
    varient: "primary",
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const button = canvasElement.querySelector("button");
    if (button) {
      // Test that button is enabled and clickable
      expect(button.disabled).toBe(false);
      // click the button
      button.click();
    }
    if (args.onClick) {
      expect(args.onClick).toHaveBeenCalled();
    }
  },
};

export const Secondary: Story = {
  args: {
    varient: "secondary",
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const button = canvasElement.querySelector("button");
    if (button) {
      // Test that button is enabled and clickable
      expect(button.disabled).toBe(false);
      // click the button
      button.click();
    }
    if (args.onClick) {
      expect(args.onClick).toHaveBeenCalled();
    }
  },
};

export const Outline: Story = {
  args: {
    varient: "outline",
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const button = canvasElement.querySelector("button");
    if (button) {
      // Test that button is enabled and clickable
      expect(button.disabled).toBe(false);
      // click the button
      button.click();
    }
    // Verify the onClick handler is called for enabled button
    if (args.onClick) {
      expect(args.onClick).toHaveBeenCalled();
    }
  },
};

export const Disabled: Story = {
  args: {
    varient: "primary",
    disabled: true,
  },
  play: async ({ args, canvasElement }) => {
    const button = canvasElement.querySelector("button");
    if (button) {
      // Check transform before click
      const computedStyle = window.getComputedStyle(button);
      expect(computedStyle.transform).toBe("none");

      button.click();

      // Check transform after click - should remain "none" for disabled button
      const styleAfterClick = window.getComputedStyle(button);
      expect(styleAfterClick.transform).toBe("none");

      // Check cursor style for disabled button
      expect(computedStyle.cursor).toBe("not-allowed");
    }
    // Verify the onClick handler is not called
    if (args.onClick) {
      expect(args.onClick).not.toHaveBeenCalled();
    }
  },
};

export const Large: Story = {
  args: {
    varient: "primary",
    className: "px-8 py-4 text-lg h-12",
    children: "Large Button",
  },
};
