import { render, screen } from "@testing-library/react";
import { Heading } from "./Heading";

describe("Heading component", () => {
    it("renders with default props", () => {
        render(<Heading title="Hello heading" />);
        expect(screen.getByText("Hello heading")).toBeInTheDocument();
    });

    it("renders with primary variant", () => {
        render(<Heading title="Primary" variant="primary" />);
        expect(screen.getByText("Primary")).toBeInTheDocument();
    });

    it("renders with error variant", () => {
        render(<Heading title="Error" variant="error" />);
        expect(screen.getByText("Error")).toBeInTheDocument();
    });

    it("renders with accent variant", () => {
        render(<Heading title="Accent" variant="accent" />);
        expect(screen.getByText("Accent")).toBeInTheDocument();
    });

    it("renders h2 for size=m", () => {
        render(<Heading title="Small heading" size="m" />);
        const header = screen.getByTestId("Header.Header");
        expect(header.tagName).toBe("H2");
    });

    it("renders h1 for size=l", () => {
        render(<Heading title="Large heading" size="l" />);
        const header = screen.getByTestId("Header.Header");
        expect(header.tagName).toBe("H1");
    });

    it("applies bold class when bold is true", () => {
        const { container } = render(<Heading title="Bold heading" bold />);
        expect(container.firstChild).toHaveClass("bold");
    });

    it("applies grow class when grow is true", () => {
        const { container } = render(<Heading title="Grow heading" grow />);
        expect(container.firstChild).toHaveClass("grow");
    });

    it("renders custom testid", () => {
        render(<Heading title="With testid" data-testid="Custom" />);
        expect(screen.getByTestId("Custom.Header")).toBeInTheDocument();
    });
});
