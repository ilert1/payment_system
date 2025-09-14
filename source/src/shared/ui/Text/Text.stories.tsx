import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "./Text";

const meta: Meta<typeof Text> = {
    title: "Shared/Text",
    component: Text,
    argTypes: {
        variant: {
            control: "select",
            options: ["textBody", "primary", "primary_light", "error", "muted"]
        },
        size: {
            control: "select",
            options: ["xxs", "2xs", "xs", "s", "m", "l", "xl", "xxl"]
        },
        align: {
            control: "select",
            options: ["left", "center", "right", "justify"]
        },
        weight: {
            control: "select",
            options: ["regular", "medium", "semiBold"]
        },
        grow: { control: "boolean" },
        onClick: { action: "clicked" }
    }
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
    args: {
        text: "Hello world"
    }
};

export const Primary: Story = {
    args: {
        text: "Primary text",
        variant: "primary",
        size: "m"
    }
};

export const Error: Story = {
    args: {
        text: "Error text",
        variant: "error",
        size: "l",
        weight: "semiBold"
    }
};

export const Centered: Story = {
    args: {
        text: "Centered text",
        align: "center",
        size: "xl",
        variant: "primary_light"
    }
};

export const WithGrow: Story = {
    args: {
        text: "This text will grow and aligned right",
        grow: true,
        align: "right"
    }
};
