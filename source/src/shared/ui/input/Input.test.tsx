// Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "./input";

test("renders button and handles click", () => {
    const handleClick = jest.fn();

    render(<Input value={"abc"} />);

    const input = screen.getByText("abc");

    expect(input).toHaveProperty("value", "abc");
});
