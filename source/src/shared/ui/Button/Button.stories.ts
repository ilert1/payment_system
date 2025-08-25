import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReactNode } from "react";
import { fn } from "storybook/test";
import { Button } from "./Button";

const meta = {
    title: "shared/Button",
    component: Button,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered"
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "secondary", "outline", "danger", "dangerSolid", "ghost"]
        },
        size: {
            control: "select",
            options: ["sm", "lg", "xl"]
        },
        loading: Boolean,
        children: { control: "text" }
    },
    args: { onClick: fn() }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    args: {
        variant: "default",
        children: "Hello"
    }
};

export const Secondary: Story = {
    args: {
        variant: "secondary",
        children: "Secondary Button"
    }
};

export const Outline: Story = {
    args: {
        variant: "outline",
        children: "Outline Button"
    }
};

export const Danger: Story = {
    args: {
        variant: "danger",
        children: "Danger Button"
    }
};

export const DangerSolid: Story = {
    args: {
        variant: "dangerSolid",
        children: "Danger Solid Button"
    }
};

export const Ghost: Story = {
    args: {
        variant: "ghost",
        children: "Ghost Button"
    }
};

/* Размеры */
export const Small: Story = {
    args: {
        size: "sm",
        children: "Small Button"
    }
};

export const Large: Story = {
    args: {
        size: "lg",
        children: "Large Button"
    }
};

export const ExtraLarge: Story = {
    args: {
        size: "xl",
        children: "XL Button"
    }
};

/* Disabled */
export const Disabled: Story = {
    args: {
        variant: "default",
        children: "Disabled Button",
        disabled: true
    }
};

/* Состояние загрузки */
export const Loading: Story = {
    args: {
        variant: "default",
        children: "Loading...",
        className: "button__loading",
        loading: true,
        style: { width: 100, height: 50 }
    }
};
