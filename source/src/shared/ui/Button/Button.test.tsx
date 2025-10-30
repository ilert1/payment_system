import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

// Example component to test
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled = false, variant = "primary" }) => (
    <button onClick={onClick} disabled={disabled} className={`btn btn-${variant}`} data-testid="custom-button">
        {children}
    </button>
);

// Tests
describe("Button Component", () => {
    test("renders button with text", () => {
        render(<Button>Click me</Button>);

        const button = screen.getByRole("button", { name: /click me/i });
        expect(button).toBeInTheDocument();
    });

    test("calls onClick handler when clicked", async () => {
        const handleClick = jest.fn();
        const user = userEvent.setup();

        render(<Button onClick={handleClick}>Click me</Button>);

        const button = screen.getByRole("button", { name: /click me/i });
        await user.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test("does not call onClick when disabled", async () => {
        const handleClick = jest.fn();
        const user = userEvent.setup();

        render(
            <Button onClick={handleClick} disabled>
                Click me
            </Button>
        );

        const button = screen.getByRole("button", { name: /click me/i });
        await user.click(button);

        expect(handleClick).not.toHaveBeenCalled();
        expect(button).toBeDisabled();
    });

    test("applies correct CSS class for variant", () => {
        render(<Button variant="secondary">Secondary Button</Button>);

        const button = screen.getByTestId("custom-button");
        expect(button).toHaveClass("btn-secondary");
    });

    test("has default primary variant", () => {
        render(<Button>Default Button</Button>);

        const button = screen.getByTestId("custom-button");
        expect(button).toHaveClass("btn-primary");
    });
});

// Example of testing with async operations
describe("Button Component - Async Tests", () => {
    test("handles async click operations", async () => {
        const asyncHandler = jest.fn().mockResolvedValue("success");
        const user = userEvent.setup();

        const AsyncButton: React.FC = () => {
            const handleClick = async () => {
                await asyncHandler();
            };

            return <Button onClick={handleClick}>Async Button</Button>;
        };

        render(<AsyncButton />);

        const button = screen.getByRole("button");
        await user.click(button);

        expect(asyncHandler).toHaveBeenCalled();
    });
});

describe("Button Component - Custom Queries", () => {
    test("finds button by custom data-testid", () => {
        render(<Button>Test Button</Button>);

        const button = screen.getByTestId("custom-button");
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent("Test Button");
    });
});
