import getBrowserFingerprint from "get-browser-fingerprint";
import { createContext, useState, useEffect, useCallback, useContext, startTransition } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ym, { YMInitializer } from "react-yandex-metrika";
import { CustomToastContainer } from "@/shared/ui/CustomToastContainer";
import CurrencyLibrary from "./shared/assets/library/Currency.json";
import i18n, { getLanguage, getLocalBankName } from "./shared/config/i18n/Localization.js";
import { AppRoutes } from "./shared/const/router.js";
import { useBFStore } from "./shared/store/bfDataStore.js";

export type YmType = typeof ym | (() => void);

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
    lang: string;
    setLang: (lang: string) => void;
    payoutMode: boolean;
    status: string | undefined;
    setStatus: (status: string) => void;
    ym: YmType;
    caseName: string;
    setCaseName: (val: string) => void;
    bankName: string;
}

export const AppContext = createContext<AppContextType | null>(null);

const azn = "azn";
const tjs = "tjs";
const iban = "iban";
const abh = "abh";
const ars = "ars";

// eslint-disable-next-line react/prop-types
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const { init, BFData, status, setStatus } = useBFStore();
    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const [bankName, setBankName] = useState("");

    const ymFunc: typeof ym | (() => void) = import.meta.env.VITE_YMETRICS_COUNTER ? ym : () => {};

    const safeYm = (...args: Parameters<typeof ym>) => {
        if (typeof ymFunc === "function" && BFData?.[dest]?.id) {
            ymFunc(...args);
        }
    };

    const navigate = useNavigate;

    const pathname = new URL(window.location.href).pathname;
    const payoutMode = pathname.split("/")[1] === "payouts";

    const { t } = useTranslation();

    const [fingerprint, setFingerprint] = useState("");
    const [fingerprintReady, setFingerprintReady] = useState(false);
    let storedLang = getLanguage();

    const [lang, setLang] = useState(storedLang);

    const [caseName, setCaseName] = useState("");

    useEffect(() => {
        startTransition(() => {
            i18n.changeLanguage(lang);
        });
        localStorage.setItem("language", lang);
    }, [lang]);

    const storedCurrentPaymentInstrument = JSON.parse(String(localStorage.getItem("CurrentPaymentInstrument")));

    const [currentPaymentInstrument, setCurrentPaymentInstrument] = useState<{ blowfishId: string; data: any } | null>(
        null
    );

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
                ym: ymFunc
            });
        } else {
            if (
                !pathname.includes(AppRoutes.PAGE_PAYMENT_NOT_FOUND) &&
                !pathname.includes(AppRoutes.PAGE_PAYOUT_NOT_FOUND)
            ) {
                window.location.replace(
                    `/${payoutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`
                );
            }
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
        console.log("STATUS: ", status);
        switch (status) {
            case "paymentAwaitingStart":
                return AppRoutes.PAGE_MAIN;
            case "paymentAwaitingSelectInstrument":
                return AppRoutes.PAGE_PAYMENT_INSTRUMENT;
            case "paymentPayerDataEntrу":
            case "paymentPayerDataEntered":
                return AppRoutes.PAYER_DATA_PAGE;
            case "paymentPayeeSearching":
                return AppRoutes.PAYEE_SEARCH_PAGE;
            case "paymentAwaitingTransfer":
                if (BFData?.[dest]?.method?.name === "ecom_platform_all") {
                    return AppRoutes.PAGE_THREE_DS;
                }
                if (BFData?.[dest]?.method?.name == "ecom" || BFData?.[dest]?.method?.name === "ecom_platform_card") {
                    return AppRoutes.PAYER_DATA_PAGE;
                }
                return AppRoutes.PAY_PAGE;
            case "paymentAwaitingConfirmationByPayee":
                return AppRoutes.PAYEE_DATA_PAGE;
            case "paymentExecuted":
                return AppRoutes.SUCCESS_PAGE;
            case "paymentError":
                return AppRoutes.PAY_ERROR_PAGE;
            case "Cancelled":
            case "paymentCanceled":
                return AppRoutes.CANCEL_PAGE;
            default:
                return "";
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    const method = BFData?.[dest]?.method;
    const trader = method?.payee?.data;

    useEffect(() => {
        setBankName(getLocalBankName(method?.bank?.display_name, lang));
    }, [, method?.bank?.display_name, lang]);

    useEffect(() => {
        setCaseName("");

        console.log(`bankName: ${bankName}`);
        const traderBankName = trader?.bank_name;
        //AZN case check
        if (
            traderBankName &&
            [
                "otherbankaz",
                "mpay",
                "kapitalbank",
                "emanat",
                "leobank",
                "unibank",
                "rabita",
                "abb",
                "birbank",
                "atb",
                "m10",
                "bankofbaku",
                "akart",
                "xalqbank",
                "abbbank",
                "expressbank",
                "express24"
            ].includes(traderBankName)
        ) {
            setCaseName(azn);
            console.log(`caseName: azn`);
        }

        //TJS case check
        if (
            traderBankName &&
            [
                "tcell",
                "babilon-m",
                "megafon",
                "kortimilli",
                "sanduk",
                "ibt",
                "matin",
                "arvand",
                "favri.cbt",
                "oriyonbonk",
                "vasl",
                "amonatbonk",
                "eskhata",
                "tawhidbank",
                "spitamenbank",
                "dushanbe",
                "alif",
                "humo"
            ].includes(traderBankName)
        ) {
            setCaseName(tjs);
            console.log(`caseName: tjs`);
        }

        //ABH case check
        if (traderBankName && ["a-mobile"].includes(traderBankName)) {
            setCaseName(abh);
            console.log(`caseName: abh`);
        }

        //IBAN case check
        if (traderBankName && trader?.iban_number) {
            setCaseName(iban);
            console.log(`caseName: iban`);
        }

        //ARS case check
        if (BFData?.[dest]?.currency && BFData?.[dest]?.currency === "ARS") {
            setCaseName(ars);
            console.log(`caseName: ars`);
        }
    }, [BFData?.[dest]?.currency, bankName, trader]);

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
                    lang,
                    setLang,
                    payoutMode,
                    status,
                    setStatus,
                    ym: safeYm,
                    caseName,
                    setCaseName,
                    bankName
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
