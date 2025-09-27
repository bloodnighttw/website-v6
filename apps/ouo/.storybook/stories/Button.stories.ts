import type { Meta, StoryObj } from "@storybook/react-vite";

import { fn } from "storybook/test";

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

export const Primary: Story = {
  args: {
    varient: "primary",
  },
};

export const Secondary: Story = {
  args: {
    varient: "secondary",
  },
};

export const Outline: Story = {
  args: {
    varient: "outline",
  },
};

export const Disabled: Story = {
  args: {
    varient: "primary",
    disabled: true,
  },
};

export const Large: Story = {
  args: {
    varient: "primary",
    className: "px-8 py-4 text-lg h-12",
    children: "Large Button",
  },
};
