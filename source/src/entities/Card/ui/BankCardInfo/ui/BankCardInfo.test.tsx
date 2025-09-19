import { render, screen, fireEvent } from "@testing-library/react";
import { BankCardInfo } from "./BankCardInfo";

describe("BankCardInfo", () => {
    it("renders card number", () => {
        render(<BankCardInfo cardNumber="**** **** **** 1234" bankIcon="test-icon.png" onError={jest.fn()} />);

        expect(screen.getByText("**** **** **** 1234")).toBeInTheDocument();
    });

    it("renders bank icon with correct src", () => {
        render(<BankCardInfo cardNumber="**** 1111" bankIcon="bank.png" onError={jest.fn()} />);

        const img = screen.getByTestId("BankCardInfo.BankIcon");
        expect(img).toHaveAttribute("src", "bank.png");
    });

    it("calls onError when image fails to load", () => {
        const onErrorMock = jest.fn();

        render(<BankCardInfo cardNumber="**** 2222" bankIcon="broken.png" onError={onErrorMock} />);

        const img = screen.getByTestId("BankCardInfo.BankIcon");
        fireEvent.error(img);

        expect(onErrorMock).toHaveBeenCalledTimes(1);
    });
});
