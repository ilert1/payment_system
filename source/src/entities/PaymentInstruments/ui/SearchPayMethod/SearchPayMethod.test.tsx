import { render, screen, fireEvent } from "@testing-library/react";
import { SearchPayMethod } from "./SearchPayMethod";

jest.mock("@/shared/assets/images/search.svg?react", () => {
    return {
        __esModule: true,
        default: (props: any) => <svg data-testid="search-icon" {...props} />
    };
});
describe("SearchPayMethod", () => {
    it("рендерит иконку и input", () => {
        const mockFn = jest.fn();
        render(<SearchPayMethod setFilterText={mockFn} />);

        expect(screen.getByTestId("search-icon")).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/transferMethod/i)).toBeInTheDocument();
    });

    it("обновляет setFilterText при вводе текста", () => {
        const mockFn = jest.fn();
        render(<SearchPayMethod setFilterText={mockFn} />);

        const input = screen.getByPlaceholderText(/transferMethod/i);
        fireEvent.input(input, { target: { value: "Visa" } });

        expect(mockFn).toHaveBeenCalledWith("Visa");
    });
});
