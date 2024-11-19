import * as c from "./assets/constants.js";
import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import i18n, { getLanguage } from "./Localization";
import { useTranslation } from "react-i18next";

import getBrowserFingerprint from "get-browser-fingerprint";
import CurrencyLibrary from "./assets/library/Currency.json";
import { binary_to_base58 } from "base58-js";

import CustomToastContainer from "./ui/CustomToastContainer";

var encoder = new TextEncoder();
export const base58 = str => {
    binary_to_base58(encoder.encode(str));
};

export const AppContext = createContext({
    navigate: null,
    supportDialog: {
        isActive: false,
        setIsActive: null
    },
    urlData: null,
    currentPaymentMethod: null,
    setCurrentPaymentMethod: null,
    currentPaymentInstrument: null,
    setCurrentPaymentInstrument: null,
    cardNumberLast4: null,
    setCardNumberLast4: null,
    traderData: null,
    setTraderData: null,
    resetStorage: null,
    t: null,
    fingerprintConfig: null,
    getCurrencySymbol: null,
    fingerprintReady: false,
    BFData: null,
    setBFData: () => {},
    failUrlParams: null,
    setFailUrlParams: null,
    lang: null,
    setLang: null,
    payoutMode: null
});

// eslint-disable-next-line react/prop-types
export const AppProvider = ({ children }) => {
    const navigate = useNavigate;
    const [supportDialogIsActive, supportDialogSetIsActive] = useState(false);

    const pathname = new URL(window.location.href).pathname;
    const payoutMode = pathname.split("/")[1] === "payouts";

    const queryClient = new QueryClient();
    const { t } = useTranslation();

    const [currentPaymentMethod, setCurrentPaymentMethod] = useState(() => {
        return JSON.parse(localStorage.getItem("CurrentPaymentMethod")) || null;
    });
    const [currentPaymentInstrument, setCurrentPaymentInstrument] = useState(() => {
        return JSON.parse(localStorage.getItem("CurrentPaymentInstrument")) || null;
    });
    const [cardNumberLast4, setCardNumberLast4] = useState(() => {
        return localStorage.getItem("last4") || null;
    });
    const [traderData, setTraderData] = useState(() => {
        return localStorage.getItem("traderData") || null;
    });

    const [BFData, setBFData] = useState(null);
    const [failUrlParams, setFailUrlParams] = useState("");
    const [fingerprint, setFingerprint] = useState(null);
    const [fingerprintReady, setFingerprintReady] = useState(false);
    let storedLang = getLanguage();
    const [lang, setLang] = useState(storedLang);

    useEffect(() => {
        i18n.changeLanguage(lang);
        localStorage.setItem("language", lang);
    }, [lang]);

    useEffect(() => {
        localStorage.setItem("CurrentPaymentMethod", JSON.stringify(currentPaymentMethod));
    }, [currentPaymentMethod]);

    useEffect(() => {
        localStorage.setItem("CurrentPaymentInstrument", JSON.stringify(currentPaymentInstrument));
    }, [currentPaymentInstrument]);

    /* useEffect(() => {
        localStorage.setItem("last4", cardNumberLast4);
    }, [cardNumberLast4]);

    useEffect(() => {
        localStorage.setItem("traderData", traderData);
    }, [traderData]); */

    useEffect(() => {
        let fp = `${getBrowserFingerprint({
            hardwareOnly: true,
            enableScreen: false
        })}`;
        setFingerprint(fp);
        setFingerprintReady(true);
    }, []);

    /* const resetStorage = () => {
        setCardNumberLast4(null);
        setTraderData(null);
        localStorage.removeItem("last4");
        localStorage.removeItem("traderData");
    }; */

    const getCurrencySymbol = code => {
        if (Object.hasOwn(CurrencyLibrary, code)) {
            return CurrencyLibrary[code].symbol_native;
        }
        return code;
    };

    const paymentEcomPage = useCallback(() => {
        const data = BFData?.payment ? BFData?.payment : BFData?.payout;
        console.log(data?.status);

        switch (data?.status) {
            case "paymentAwaitingStart":
                return c.PAGE_MAIN;
            case "paymentMethodSelecting":
                return c.PAGE_PAYMENT_METHODS;
            case "payoutBankSelecting":
                return c.PAGE_PAYMENT_INSTRUMENT;
            case "paymentPayerDataEntrу":
                return c.PAGE_PAYER_DATA;
            case "paymentPayeeSearching":
                return c.PAGE_PAYEE_SEARCH;
            case "paymentAwaitingTransfer":
                if (data?.method?.name === "ecom") return c.PAGE_PAYER_DATA;
                return c.PAGE_PAY;
            case "paymentAwaitingConfirmationByPayee":
                return c.PAGE_PAYEE_DATA;
            case "paymentExecuted":
                return c.PAGE_SUCCESS;
            case "paymentError":
                return "/" + c.PAGE_PAYMENT_NOT_FOUND;
            case "paymentCanceled":
                return c.PAGE_CANCEL;
            default:
                return "";
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [BFData?.payment?.status, BFData?.payout?.status]);

    return (
        <QueryClientProvider client={queryClient}>
            <AppContext.Provider
                value={{
                    navigate,
                    supportDialog: {
                        isActive: supportDialogIsActive,
                        setIsActive: supportDialogSetIsActive
                    },
                    currentPaymentMethod,
                    setCurrentPaymentMethod,
                    currentPaymentInstrument,
                    setCurrentPaymentInstrument,
                    cardNumberLast4,
                    setCardNumberLast4,
                    traderData,
                    setTraderData,
                    // resetStorage,
                    t,
                    fingerprintConfig: {
                        headers: {
                            "X-Fingerprint": fingerprint,
                            "Accept-Language": [lang, ...navigator.languages].toString()
                        }
                    },
                    getCurrencySymbol,
                    paymentEcomPage,
                    fingerprintReady,
                    BFData,
                    setBFData,
                    failUrlParams,
                    setFailUrlParams,
                    lang,
                    setLang,
                    payoutMode
                }}>
                {children}
                <CustomToastContainer />
            </AppContext.Provider>
        </QueryClientProvider>
    );
};

export default AppContext;
