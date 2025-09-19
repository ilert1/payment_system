import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "./Heading";

const meta: Meta<typeof Heading> = {
    title: "Shared/Heading",
    tags: ["autodocs"],
    component: Heading,
    argTypes: {
        variant: {
            control: "select",
            options: ["primary", "error", "accent"]
        },
        align: {
            control: "select",
            options: ["left", "center", "right"]
        },
        size: {
            control: "select",
            options: ["m", "l"]
        },
        bold: { control: "boolean" },
        grow: { control: "boolean" }
    }
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {
    args: {
        title: "Default heading"
    }
};

export const Primary: Story = {
    args: {
        title: "Primary heading",
        variant: "primary",
        size: "m"
    }
};

export const Error: Story = {
    args: {
        title: "Error heading",
        variant: "error",
        size: "l"
    }
};

export const Accent: Story = {
    args: {
        title: "Accent heading",
        variant: "accent",
        align: "center"
    }
};

export const Bold: Story = {
    args: {
        title: "Bold heading",
        bold: true
    }
};

export const Grow: Story = {
    args: {
        title: "Heading with grow",
        grow: true
    }
};
