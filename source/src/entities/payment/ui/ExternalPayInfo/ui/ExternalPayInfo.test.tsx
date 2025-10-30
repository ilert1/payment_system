import { render, screen } from "@testing-library/react";
import { ExternalPayInfo } from "./ExternalPayInfo";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key
    })
}));

jest.mock("@/shared/assets/images/link-to-app-icon.svg?react", () => {
    return {
        __esModule: true,
        default: (props: any) => <svg data-testid="link-to-app-icon-icon" {...props} />
    };
});

describe("ExternalPayInfo", () => {
    const testUrl = "https://example.com/payment";

    it("renders scan QR code text", () => {
        render(<ExternalPayInfo url={testUrl} />);
        expect(screen.getByText("scanQrCode")).toBeInTheDocument();
    });

    it("renders link with correct href", () => {
        render(<ExternalPayInfo url={testUrl} />);
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", testUrl);
    });

    it("renders link text from i18n", () => {
        render(<ExternalPayInfo url={testUrl} />);
        expect(screen.getByText("linkToApp")).toBeInTheDocument();
    });

    it("renders QRCode with provided url", () => {
        render(<ExternalPayInfo url={testUrl} />);
        const svg = screen.getByTestId("qr-code");
        expect(svg).toBeInTheDocument();
    });
});
