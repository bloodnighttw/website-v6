import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn, expect } from "storybook/test";

import { Card } from "@/components/button/card";

const meta = {
  title: "Component/ButtonLabel",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
  args: {
    onClick: fn(),
    children: "ButtonLabel",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const button = canvasElement.querySelector("button");
    if (button) {
      expect(button.disabled).toBe(false);
      button.click();
    }
    if (args.onClick) {
      expect(args.onClick).toHaveBeenCalled();
    }
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async ({ args, canvasElement }) => {
    const button = canvasElement.querySelector("button");
    if (button) {
      expect(button.disabled).toBe(true);
      button.click();
    }
    if (args.onClick) {
      expect(args.onClick).not.toHaveBeenCalled();
    }
  },
};

export const Large: Story = {
  args: {
    className: "px-12 py-4 text-2xl h-14",
    children: "Large ButtonLabel",
  },
};
