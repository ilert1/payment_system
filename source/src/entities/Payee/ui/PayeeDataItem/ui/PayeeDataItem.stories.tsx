import type { Meta, StoryObj } from "@storybook/react";
import BankIcon from "@/shared/assets/images/copy.svg?react";
import { AppContextDecorator } from "@/shared/config/storybook";
import { i18nDecorator } from "@/shared/config/storybook/i18nDecorator";
import { PayeeDataItem } from "./PayeeDataItem";

const meta: Meta<typeof PayeeDataItem> = {
    title: "Entities/PayeeDataItem",
    component: PayeeDataItem,
    tags: ["autodocs"],
    decorators: [AppContextDecorator, i18nDecorator],
    argTypes: {
        onError: { action: "onError" }
    }
};

export default meta;
type Story = StoryObj<typeof PayeeDataItem>;

export const Default: Story = {
    args: {
        Img: BankIcon,
        label: "Account number",
        value: "4081 2345 6789 0000"
    }
};

export const WithComment: Story = {
    args: {
        Img: BankIcon,
        label: "Payment purpose",
        value: "Invoice #1024",
        comment: "Please pay within 5 days"
    }
};

export const WithCopy: Story = {
    args: {
        Img: BankIcon,
        label: "Card number",
        value: "**** **** **** 1234",
        copyData: "1234567812345678",
        messageOnCopy: "Copied!"
    }
};
