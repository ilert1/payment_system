import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppContextDecorator } from "@/shared/config/storybook";
import { i18nDecorator } from "@/shared/config/storybook/i18nDecorator";
import { Page } from "./Page";

const meta = {
    title: "widgets/Page",
    component: Page,
    parameters: {
        layout: "centered"
    },
    decorators: [AppContextDecorator, i18nDecorator],
    tags: ["autodocs"],
    argTypes: {}
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithText: Story = {
    args: {
        children: <p>Hello world!</p>
    }
};

export const WithMultipleElements: Story = {
    args: {
        children: (
            <div>
                <h2>Заголовок</h2>
                <p>Какой-то текст внутри Page</p>
            </div>
        )
    }
};
