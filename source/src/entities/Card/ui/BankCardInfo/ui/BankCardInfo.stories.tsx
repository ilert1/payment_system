import type { Meta, StoryObj } from "@storybook/react";
import { BankCardInfo } from "./BankCardInfo";

const meta: Meta<typeof BankCardInfo> = {
    title: "Entities/Card/BankCardInfo",
    component: BankCardInfo,
    argTypes: {
        onError: { action: "onError" }
    }
};

export default meta;
type Story = StoryObj<typeof BankCardInfo>;

export const Default: Story = {
    args: {
        cardNumber: "**** **** **** 1234",
        bankIcon: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
    }
};

export const WithBrokenIcon: Story = {
    args: {
        cardNumber: "**** **** **** 5678",
        bankIcon: "broken-link.png"
    }
};
