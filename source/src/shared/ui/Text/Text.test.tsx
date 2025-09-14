import { render, screen, fireEvent } from "@testing-library/react";
import { Text } from "./Text";

describe("Text component", () => {
    it("renders with default props", () => {
        render(<Text text="Hello world" />);
        expect(screen.getByText("Hello world")).toBeInTheDocument();
    });

    it("applies variant class", () => {
        render(<Text text="Primary" variant="primary" />);
        const element = screen.getByText("Primary");
        expect(element).toBeInTheDocument();
    });

    it("applies alignment", () => {
        render(<Text text="Centered" align="center" />);
        const element = screen.getByText("Centered");
        expect(element).toBeInTheDocument();
        expect(element.parentElement).toHaveClass("center");
    });

    it("applies size", () => {
        render(<Text text="Large" size="xl" />);
        const element = screen.getByText("Large");
        expect(element).toBeInTheDocument();
    });

    it("applies weight", () => {
        render(<Text text="Bold" weight="semiBold" />);
        const element = screen.getByText("Bold");
        expect(element).toBeInTheDocument();
    });

    it("fires onClick event", () => {
        const handleClick = jest.fn();
        render(<Text text="Clickable" onClick={handleClick} />);
        fireEvent.click(screen.getByText("Clickable"));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("renders grow class when grow is true", () => {
        const { container } = render(<Text text="Grow text" grow />);
        expect(container.firstChild).toHaveClass("grow");
    });

    it("renders custom testid", () => {
        render(<Text text="With testid" data-testid="CustomID" />);
        expect(screen.getByTestId("CustomID.Paragraph")).toBeInTheDocument();
    });
});
