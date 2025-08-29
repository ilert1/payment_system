import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Input } from "./input";

const meta = {
    title: "shared/Input",
    component: Input,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered"
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        textSize: {
            control: "select",
            options: ["sm", "md", "lg"]
        },
        bgWhite: Boolean,
        value: String
    }
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const PrimaryTextMd: Story = {
    render: () => {
        return (
            <div style={{ backgroundColor: "grey", padding: "20px 10px" }}>
                <Input textSize="md" bgWhite={true} value="Hello" />
            </div>
        );
    }
};

export const TextSm: Story = {
    render: () => {
        return (
            <div style={{ backgroundColor: "grey", padding: "20px 10px" }}>
                <Input textSize="sm" bgWhite={true} value="Hello" />
            </div>
        );
    }
};

export const TextLg: Story = {
    render: () => {
        return (
            <div style={{ backgroundColor: "grey", padding: "20px 10px" }}>
                <Input textSize="lg" bgWhite={true} value="Hello" />
            </div>
        );
    }
};
