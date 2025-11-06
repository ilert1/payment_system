import type { Meta, StoryObj } from "@storybook/react";
import { i18nDecorator } from "@/shared/config/storybook/i18nDecorator";
import { ExternalPayInfo } from "./ExternalPayInfo";

const meta: Meta<typeof ExternalPayInfo> = {
    title: "Entities/Payment/ExternalPayInfo",
    component: ExternalPayInfo,
    decorators: [i18nDecorator],
    tags: ["autodocs"],
    argTypes: {
        url: { control: "text" }
    }
};

export default meta;
type Story = StoryObj<typeof ExternalPayInfo>;

export const Default: Story = {
    args: {
        url: "https://example.com/payment"
    }
};

export const WithAnotherUrl: Story = {
    args: {
        url: "https://google.com/"
    }
};
