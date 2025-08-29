// CustomToastContainer.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { toast } from "react-toastify";
import { Button } from "../Button/Button";
import { CustomToastContainer } from "./CustomToastContainer";

const meta: Meta<typeof CustomToastContainer> = {
    title: "shared/CustomToastContainer",
    component: CustomToastContainer,
    argTypes: {},
    parameters: {
        layout: "centered"
    }
};
export default meta;

type Story = StoryObj<typeof CustomToastContainer>;

export const WithToast: Story = {
    render: () => (
        <>
            <CustomToastContainer />
            <Button onClick={() => toast("Обычный тост")}>Показать тост</Button>
        </>
    )
};

export const MultipleToasts: Story = {
    render: () => (
        <>
            <CustomToastContainer />
            <Button
                onClick={() => {
                    toast("Первый тост");
                    toast.success("Успех!");
                    toast.error("Ошибка!");
                }}>
                Показать несколько
            </Button>
        </>
    )
};
