import { render, screen, fireEvent, act } from "@testing-library/react";
import { PayeeDataItem } from "./PayeeDataItem";

jest.mock("@/AppContext", () => ({
    useAppContext: () => ({
        ym: jest.fn()
    })
}));

jest.mock("@/shared/assets/images/check-circle.svg?react", () => {
    return {
        __esModule: true,
        default: (props: any) => <svg data-testid="check-circle-icon" {...props} />
    };
});

jest.mock("@/shared/assets/images/copy.svg?react", () => {
    return {
        __esModule: true,
        default: (props: any) => <svg data-testid="copy-icon" {...props} />
    };
});

describe("PayeeDataItem", () => {
    it("renders label and value", () => {
        render(<PayeeDataItem Img="" label="Account" value="1234" />);
        expect(screen.getByText("Account")).toBeInTheDocument();
        expect(screen.getByText("1234")).toBeInTheDocument();
    });

    it("renders comment when provided", () => {
        render(<PayeeDataItem Img="" label="Note" value="Value" comment="Extra info" />);
        expect(screen.getByText("Extra info")).toBeInTheDocument();
    });

    it("renders svg icon when Img is a component", () => {
        const Svg = (props: any) => <svg data-testid="svg-icon" {...props} />;
        render(<PayeeDataItem Img={Svg} label="Icon label" value="Value" />);
        expect(screen.getByTestId("svg-icon")).toBeInTheDocument();
    });

    it("renders img tag when Img is string", () => {
        render(<PayeeDataItem Img="bank.png" label="Bank" value="Value" />);
        const img = screen.getByTestId("PayeeDataItem.img");
        expect(img).toHaveAttribute("src", "bank.png");
    });

    it("shows popup after copy and hides it after timeout", () => {
        jest.useFakeTimers();
        render(
            <PayeeDataItem Img="" label="Card" value="**** 1234" copyData="1234567812345678" messageOnCopy="Copied!" />
        );

        const copyButton = screen.getByTestId("PayeeDataItem.Button");
        const popup = screen.getByTestId("PayeeDataItem.popup");

        expect(popup).not.toHaveClass("active");

        fireEvent.click(copyButton);

        expect(popup).toHaveClass("active");

        act(() => {
            jest.advanceTimersByTime(1500);
        });

        expect(popup).not.toHaveClass("active");
        jest.useRealTimers();
    });
});
