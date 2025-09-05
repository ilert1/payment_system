// CustomToastContainer.test.tsx
import { act, render, screen } from "@testing-library/react";
import { toast } from "react-toastify";
import { CustomToastContainer } from "./CustomToastContainer";

describe("CustomToastContainer", () => {
    it("рендерится без ошибок", () => {
        const { container } = render(<CustomToastContainer />);
        expect(container.getElementsByClassName("Toastify")).toHaveLength(1);
    });

    it("отображает тост при вызове toast()", async () => {
        render(<CustomToastContainer />);
        act(() => toast("Hello world!"));

        const toastMessage = await screen.findByText("Hello world!");
        expect(toastMessage).toBeInTheDocument();
    });
});
