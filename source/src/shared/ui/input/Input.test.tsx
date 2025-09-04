import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./input";

describe("Input component", () => {
    test("рендерится с дефолтными пропсами", () => {
        render(<Input placeholder="Введите текст" />);
        const input = screen.getByPlaceholderText("Введите текст");
        expect(input).toBeInTheDocument();
        expect(input).toHaveClass("input"); // базовый класс
    });

    test("поддерживает передачу className", () => {
        render(<Input placeholder="custom" className="custom-class" />);
        const input = screen.getByPlaceholderText("custom");
        expect(input).toHaveClass("custom-class");
    });

    test("добавляет класс bgwhite, если bgWhite = true (по умолчанию)", () => {
        render(<Input placeholder="bg" />);
        const input = screen.getByPlaceholderText("bg");
        expect(input.className).toMatch(/bgwhite/);
    });

    test("не добавляет bgwhite, если bgWhite = false", () => {
        render(<Input placeholder="no-bg" bgWhite={false} />);
        const input = screen.getByPlaceholderText("no-bg");
        expect(input.className).not.toMatch(/bgwhite/);
    });

    test("применяет класс textSize (sm)", () => {
        render(<Input placeholder="size" textSize="sm" />);
        const input = screen.getByPlaceholderText("size");
        expect(input.className).toMatch(/textSm/);
    });

    test("применяет класс textSize (lg)", () => {
        render(<Input placeholder="size" textSize="lg" />);
        const input = screen.getByPlaceholderText("size");
        expect(input.className).toMatch(/textLg/);
    });

    test("поддерживает ввод текста пользователем", async () => {
        render(<Input placeholder="type here" />);
        const input = screen.getByPlaceholderText("type here") as HTMLInputElement;

        await userEvent.type(input, "hello");
        expect(input.value).toBe("hello");
    });

    test("ref корректно работает", () => {
        const ref = { current: null as HTMLInputElement | null };
        render(<Input placeholder="ref-test" ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
});
