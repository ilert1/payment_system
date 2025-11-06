import { render, screen } from "@testing-library/react";
import { PayHeader } from "./PayHeader";

// мок i18n
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

// мок DeadLineTimer (чтобы не зависеть от внутренней логики таймера)
jest.mock("@/shared/ui/DeadlineTimer/DeadLineTimer", () => ({
    DeadLineTimer: ({ timerSecondsTo }: { timerSecondsTo: number }) => (
        <div data-testid="deadline-timer">{`Timer: ${timerSecondsTo}`}</div>
    )
}));

describe("PayHeader", () => {
    const baseProps = {
        amount: "1000",
        currency: "USD",
        bankName: "Bank of America",
        countryName: "USA",
        transgran: true,
        timestamp: Math.floor(Date.now() / 1000)
    };

    it("renders transfer text and amount with currency", () => {
        render(<PayHeader {...baseProps} />);
        expect(screen.getByText(/transfer/)).toBeInTheDocument();
        expect(screen.getByText(/1000 USD/)).toBeInTheDocument();
    });

    it("renders country when transgran is true", () => {
        render(<PayHeader {...baseProps} />);
        expect(screen.getByText(/country.USA/)).toBeInTheDocument();
    });

    it("does not render country when transgran is false", () => {
        render(<PayHeader {...baseProps} transgran={false} />);
        expect(screen.queryByText(/country.USA/)).not.toBeInTheDocument();
    });

    it("renders bank name when provided", () => {
        render(<PayHeader {...baseProps} />);
        expect(screen.getByText(/to Bank of America/)).toBeInTheDocument();
    });

    it("does not render bank name when empty", () => {
        render(<PayHeader {...baseProps} bankName="" />);
        expect(screen.queryByText(/to/)).not.toBeInTheDocument();
    });

    it("passes positive timerSecondsTo to DeadLineTimer", () => {
        render(<PayHeader {...baseProps} />);
        const timer = screen.getByTestId("deadline-timer");
        expect(timer.textContent).toMatch(/Timer: \d+/);
    });

    it("passes 0 to DeadLineTimer if timeLeft < 0", () => {
        render(<PayHeader {...baseProps} timestamp={0} />);
        const timer = screen.getByTestId("deadline-timer");
        expect(timer.textContent).toBe("Timer: 0");
    });
});
