import { Decorator } from "@storybook/react";
import { I18nextProvider } from "react-i18next";
import i18nForTests from "../i18n/i18nForTests";

export const i18nDecorator: Decorator = Story => (
    <I18nextProvider i18n={i18nForTests}>
        <Story />
    </I18nextProvider>
);
