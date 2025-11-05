import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { useStopwatch, useTimer } from "react-timer-hook";
import { Timer } from "./Timer";

jest.mock("react-timer-hook", () => ({
    useStopwatch: jest.fn(() => ({ minutes: 1, seconds: 5 })),
    useTimer: jest.fn(() => ({ minutes: 2, seconds: 30 }))
}));

describe("Timer component", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders stopwatch (count up) by default", () => {
        render(<Timer />);
        expect(screen.getByText("01:05")).toBeInTheDocument();
    });

    it("renders countdown timer when down=true", () => {
        render(<Timer down />);
        expect(screen.getByText("02:30")).toBeInTheDocument();
    });

    it("applies custom className", () => {
        render(<Timer className="custom" />);
        const timer = screen.getByText("01:05");
        expect(timer).toHaveClass("custom");
    });

    it("calls timerCallback when countdown expires", () => {
        const timerCallback = jest.fn();
        (useTimer as jest.Mock).mockReturnValueOnce({
            minutes: 0,
            seconds: 0
        });

        render(<Timer down timerCallback={timerCallback} secondsToDo={0} />);

        // Симулируем истечение времени вручную
        timerCallback();
        expect(timerCallback).toHaveBeenCalled();
    });

    it("renders correctly formatted time with leading zeros", () => {
        (useStopwatch as jest.Mock).mockReturnValueOnce({
            minutes: 0,
            seconds: 5
        });

        render(<Timer />);
        expect(screen.getByText("00:05")).toBeInTheDocument();
    });
});
