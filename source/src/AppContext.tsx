import * as c from "./shared/assets/constants.js";
import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";

import i18n, { getLanguage } from "./Localization.js";
import { useTranslation } from "react-i18next";

import getBrowserFingerprint from "get-browser-fingerprint";
import CurrencyLibrary from "./shared/assets/library/Currency.json";

import CustomToastContainer from "./shared/ui/CustomToastContainer.js";

import ym, { YMInitializer } from "react-yandex-metrika";
import { useBFStore } from "./shared/store/bfDataStore.js";
import { AppRoutes } from "./shared/const/router.js";

export interface AppContextType {
    navigate: ReturnType<typeof useNavigate> | null;
    currentPaymentInstrument: any;
    setCurrentPaymentInstrument: (value: any) => void;
    t: (key: string, options?: any) => string;
    fingerprintConfig: {
        headers: {
            "X-Fingerprint": string;
            "Accept-Language": string;
        };
    };
    getCurrencySymbol: (code: string) => string;
    paymentEcomPage: () => string;
    fingerprintReady: boolean;
    failUrlParams: string;
    setFailUrlParams: (value: string) => void;
    lang: string;
    setLang: (lang: string) => void;
    payoutMode: boolean;
    status: string | undefined;
    setStatus: (status: string) => void;
    ym: typeof ym | (() => void);
    caseName: string;
    setCaseName: (val: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

// eslint-disable-next-line react/prop-types
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const { init } = useBFStore();

    const navigate = useNavigate;
    const navigateLocal = useNavigate();

    const pathname = new URL(window.location.href).pathname;
    const payoutMode = pathname.split("/")[1] === "payouts";

    const { t } = useTranslation();

    const [BFData, setBFData] = useState<BFDataType | null>(null);
    const [failUrlParams, setFailUrlParams] = useState("");
    const [fingerprint, setFingerprint] = useState("");
    const [fingerprintReady, setFingerprintReady] = useState(false);
    let storedLang = getLanguage();

    const [lang, setLang] = useState(storedLang);

    const [status, setStatus] = useState("");
    const [caseName, setCaseName] = useState("");

    useEffect(() => {
        i18n.changeLanguage(lang);
        localStorage.setItem("language", lang);
    }, [lang]);

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const storedCurrentPaymentInstrument = JSON.parse(String(localStorage.getItem("CurrentPaymentInstrument")));

    const [currentPaymentInstrument, setCurrentPaymentInstrument] = useState<PaymentInstrument | null>(null);

    useEffect(() => {
        if (!storedCurrentPaymentInstrument?.data || !BFData?.[dest]?.id) return;

        if (storedCurrentPaymentInstrument.blowfishId !== BFData?.[dest]?.id) {
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

    useEffect(() => {
        const pathname = new URL(window.location.href).pathname;
        const blowfishId = pathname.split("/")[2];
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        console.log("testing uuid");

        if (uuidRegex.test(blowfishId)) {
            init({
                id: blowfishId,
                payoutMode,
                fingerprintConfig: {
                    headers: {
                        "X-Fingerprint": fingerprint,
                        "Accept-Language": [lang, ...navigator.languages].toString()
                    }
                },
                ym
            });
        } else {
            navigateLocal(`/${payoutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`, {
                replace: true
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCurrencySymbol = (code: string) => {
        if (CurrencyLibrary.hasOwnProperty(code)) {
            return CurrencyLibrary[code].symbol_native;
        }
        return code;
    };

    const paymentEcomPage = useCallback(() => {
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
                if (BFData?.[dest]?.method?.name == "ecom") {
                    return c.PAGE_PAYER_DATA;
                }
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
        <>
            {import.meta.env.VITE_YMETRICS_COUNTER && (
                <YMInitializer
                    accounts={[Number(import.meta.env.VITE_YMETRICS_COUNTER)]}
                    options={{ clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true }}
                    version="2"
                />
            )}
            <AppContext.Provider
                value={{
                    navigate,
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
                    failUrlParams,
                    setFailUrlParams,
                    lang,
                    setLang,
                    payoutMode,
                    status,
                    setStatus,
                    ym: import.meta.env.VITE_YMETRICS_COUNTER ? ym : () => {},
                    caseName,
                    setCaseName
                }}>
                {children}
                <CustomToastContainer />
            </AppContext.Provider>
        </>
    );
};

export const useAppContext = (): AppContextType => {
    const ctx = useContext(AppContext);
    if (!ctx) {
        throw new Error("useAppContext must be used within AppProvider");
    }
    return ctx;
};
