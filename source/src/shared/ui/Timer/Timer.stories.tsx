import type { Meta, StoryObj } from "@storybook/react";
import { Timer } from "./Timer";

const meta: Meta<typeof Timer> = {
    title: "shared/Timer",
    component: Timer,
    tags: ["autodocs"],
    argTypes: {
        down: {
            control: "boolean",
            description: "If true, timer counts down instead of up"
        },
        secondsToDo: {
            control: "number",
            description: "Total seconds to count down from"
        },
        size: {
            control: "radio",
            options: ["md", "lg"],
            description: "Size of timer text"
        },
        marginTop: {
            control: "boolean",
            description: "Adds margin-top style variant"
        }
    }
};

export default meta;
type Story = StoryObj<typeof Timer>;

export const Stopwatch: Story = {
    args: {
        down: false,
        size: "md"
    }
};

export const Countdown: Story = {
    args: {
        down: true,
        secondsToDo: 10,
        timerCallback: () => alert("Time's up!"),
        size: "lg"
    }
};

export const WithMargin: Story = {
    args: {
        down: false,
        marginTop: true
    }
};
