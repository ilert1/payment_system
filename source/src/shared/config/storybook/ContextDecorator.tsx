import { Decorator } from "@storybook/react";
import { AppContext, AppContextType } from "@/AppContext";

const mockValue: AppContextType = {
    navigate: () => {},
    currentPaymentInstrument: null,
    setCurrentPaymentInstrument: () => {},
    t: key => key,
    fingerprintConfig: {
        headers: {
            "X-Fingerprint": "mock-fp",
            "Accept-Language": "en"
        }
    },
    getCurrencySymbol: code => code,
    paymentEcomPage: () => "/mock-page",
    fingerprintReady: true,
    lang: "en",
    setLang: () => {},
    payoutMode: false,
    status: "paymentAwaitingStart",
    setStatus: () => {},
    ym: () => {},
    caseName: "azn",
    setCaseName: () => {},
    bankName: "MockBank"
};

export const AppContextDecorator: Decorator = Story => (
    <AppContext.Provider value={mockValue}>
        <Story />
    </AppContext.Provider>
);
