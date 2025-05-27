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

import ym from "react-yandex-metrika";

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
    currentPaymentInstrument: null,
    setCurrentPaymentInstrument: null,
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
    payoutMode: null,
    status: undefined,
    setStatus: () => {},
    ym: () => {},
});

// eslint-disable-next-line react/prop-types
export const AppProvider = ({ children }) => {
    const navigate = useNavigate;
    const [supportDialogIsActive, supportDialogSetIsActive] = useState(false);

    const pathname = new URL(window.location.href).pathname;
    const payoutMode = pathname.split("/")[1] === "payouts";

    const queryClient = new QueryClient();
    const { t } = useTranslation();

    const [BFData, setBFData] = useState(null);
    const [failUrlParams, setFailUrlParams] = useState("");
    const [fingerprint, setFingerprint] = useState(null);
    const [fingerprintReady, setFingerprintReady] = useState(false);
    let storedLang = getLanguage();
    const [lang, setLang] = useState(storedLang);

    const [status, setStatus] = useState();

    useEffect(() => {
        i18n.changeLanguage(lang);
        localStorage.setItem("language", lang);
    }, [lang]);

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const storedCurrentPaymentInstrument = JSON.parse(localStorage.getItem("CurrentPaymentInstrument"));

    const [currentPaymentInstrument, setCurrentPaymentInstrument] = useState();

    

    useEffect(() => {
        if (!storedCurrentPaymentInstrument?.data || !BFData?.[dest]?.id) return;

        if (storedCurrentPaymentInstrument.blowfishId !== BFData[dest].id) {
            localStorage.removeItem("CurrentPaymentInstrument");
            setCurrentPaymentInstrument(null);
            return;
        }

        if (currentPaymentInstrument?.data) {
            const instrument = {
                blowfishId: BFData?.[dest]?.id,
                data: currentPaymentInstrument?.data
            };
            localStorage.setItem("CurrentPaymentInstrument", JSON.stringify(instrument));
            setCurrentPaymentInstrument(instrument);
        } else {
            setCurrentPaymentInstrument(storedCurrentPaymentInstrument);
        }
    }, [BFData?.[dest]?.id]);

    useEffect(() => {
        if (currentPaymentInstrument?.data) {
            localStorage.setItem("CurrentPaymentInstrument", JSON.stringify(currentPaymentInstrument));
        }
    }, [currentPaymentInstrument]);

    useEffect(() => {
        let fp = `${getBrowserFingerprint({
            hardwareOnly: true,
            enableScreen: false
        })}`;
        setFingerprint(fp);
        setFingerprintReady(true);
    }, []);

    const getCurrencySymbol = code => {
        if (Object.hasOwn(CurrencyLibrary, code)) {
            return CurrencyLibrary[code].symbol_native;
        }
        return code;
    };

    const paymentEcomPage = useCallback(() => {
        const data = BFData?.payment ? BFData?.payment : BFData?.payout;

        console.log("status:");
        console.log(status);

        switch (status) {
            case "paymentAwaitingStart":
                return c.PAGE_MAIN;
            case "paymentAwaitingSelectInstrument":
            case "paymentPayerSelectingInstrument":
                return c.PAGE_PAYMENT_INSTRUMENT;
            case "paymentPayerDataEntrу":
            case "paymentPayerDataEntered":
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
                return c.PAGE_PAY_ERROR;
            case "Cancelled":
            case "paymentCanceled":
                return c.PAGE_CANCEL;
            default:
                return "";
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    return (
        <QueryClientProvider client={queryClient}>
            <AppContext.Provider
                value={{
                    navigate,
                    supportDialog: {
                        isActive: supportDialogIsActive,
                        setIsActive: supportDialogSetIsActive
                    },
                    currentPaymentInstrument,
                    setCurrentPaymentInstrument,
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
                    payoutMode,
                    status,
                    setStatus,
                    ym
                }}>
                {children}
                <CustomToastContainer />
            </AppContext.Provider>
        </QueryClientProvider>
    );
};

export default AppContext;
