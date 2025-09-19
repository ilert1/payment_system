import type { Meta, StoryObj } from "@storybook/react";
import { ContentDescription } from "./ContentDescription";

const meta: Meta<typeof ContentDescription> = {
    title: "Entities/Payment/ContentDescription",
    component: ContentDescription,
    tags: ["autodocs"],
    argTypes: {
        text: { control: "text" },
        lowMb: { control: "boolean" },
        grow: { control: "boolean" },
        lowMt: { control: "boolean" }
    }
};

export default meta;
type Story = StoryObj<typeof ContentDescription>;

export const Default: Story = {
    args: {
        text: "This is a default description text"
    }
};

export const WithLowMarginBottom: Story = {
    args: {
        text: "Description with low margin-bottom",
        lowMb: true
    }
};

export const WithGrow: Story = {
    args: {
        text: "This description grows",
        grow: true
    }
};

export const WithLowMarginTop: Story = {
    args: {
        text: "Description with low margin-top",
        lowMt: true
    }
};

export const WithReactNode: Story = {
    args: {
        text: <span style={{ color: "red" }}>Custom ReactNode text</span>
    }
};
