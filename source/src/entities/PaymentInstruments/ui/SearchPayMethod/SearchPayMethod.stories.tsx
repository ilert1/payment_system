import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SearchPayMethod } from "./SearchPayMethod";

const meta: Meta<typeof SearchPayMethod> = {
    title: "Entities/PaymentInstruments/SearchPayMethod",
    component: SearchPayMethod,
    tags: ["autodocs"],
    parameters: {
        layout: "centered"
    }
};
export default meta;

type Story = StoryObj<typeof SearchPayMethod>;

export const Default: Story = {
    render: function DefaultRender() {
        const [filterText, setFilterText] = useState("");
        return (
            <div style={{ width: "300px" }}>
                <SearchPayMethod setFilterText={setFilterText} />
                <p>Filter text: {filterText}</p>
            </div>
        );
    }
};
