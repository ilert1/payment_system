import type { Meta, StoryObj } from "@storybook/react";
import { i18nDecorator } from "@/shared/config/storybook/i18nDecorator";
import { PayHeader } from "./PayHeader";

const meta: Meta<typeof PayHeader> = {
    title: "Entities/Payment/PayHeader",
    component: PayHeader,
    decorators: [i18nDecorator],
    tags: ["autodocs"],
    argTypes: {
        amount: { control: "text" },
        currency: { control: "text" },
        bankName: { control: "text" },
        countryName: { control: "text" },
        transgran: { control: "boolean" },
        timestamp: { control: "number" }
    }
};

export default meta;
type Story = StoryObj<typeof PayHeader>;

export const Default: Story = {
    args: {
        amount: "1000",
        currency: "USD",
        bankName: "Bank of America",
        countryName: "USA",
        transgran: true,
        timestamp: Math.floor(Date.now() / 1000) // текущее время
    }
};

export const WithoutCountry: Story = {
    args: {
        amount: "500",
        currency: "EUR",
        bankName: "Deutsche Bank",
        transgran: false,
        timestamp: Math.floor(Date.now() / 1000)
    }
};

export const WithoutBank: Story = {
    args: {
        amount: "250",
        currency: "GBP",
        countryName: "UK",
        transgran: true,
        bankName: "",
        timestamp: Math.floor(Date.now() / 1000)
    }
};
