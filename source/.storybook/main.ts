import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: ["@chromatic-com/storybook", "@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest"],
    framework: {
        name: "@storybook/react-vite",
        options: {}
    },
    async viteFinal(config) {
        config.css = {
            preprocessorOptions: {
                scss: {
                    additionalData: `
            @use "@/app/styles/index.scss" as *;
          `
                }
            }
        };
        return config;
    }
};
export default config;
