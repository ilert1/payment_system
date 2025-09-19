import { render, screen } from "@testing-library/react";
import { ContentDescription } from "./ContentDescription";

describe("ContentDescription", () => {
    it("renders string text inside Text component", () => {
        render(<ContentDescription text="Hello World" />);
        expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    it("renders ReactNode directly", () => {
        render(<ContentDescription text={<span data-testid="custom-node">Node</span>} />);
        expect(screen.getByTestId("custom-node")).toBeInTheDocument();
    });

    it("applies lowMb class when lowMb is true", () => {
        const { container } = render(<ContentDescription text="Test" lowMb />);
        expect(container.firstChild).toHaveClass("lowMb");
    });

    it("applies grow class when grow is true", () => {
        const { container } = render(<ContentDescription text="Test" grow />);
        expect(container.firstChild).toHaveClass("grow");
    });

    it("applies lowMt class when lowMt is true", () => {
        const { container } = render(<ContentDescription text="Test" lowMt />);
        expect(container.firstChild).toHaveClass("lowMt");
    });
});
