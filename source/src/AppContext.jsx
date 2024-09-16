import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCookie, { setCookie } from "react-use-cookie";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import i18n, { getLanguage } from "./Localization";
import { useTranslation } from "react-i18next";

import getBrowserFingerprint from "get-browser-fingerprint";

import CurrencyLibrary from "./assets/library/Currency.json";
import { binary_to_base58 } from "base58-js";

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
    resetCookies: null,
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

export const AppProvider = ({ children }) => {
    const navigate = useNavigate;
    const [supportDialogIsActive, supportDialogSetIsActive] = useState(false);

    const pathname = new URL(window.location.href).pathname;
    const payoutMode = pathname.split("/")[1] == "payouts";

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const blowfishId = uuidRegex.test(pathname.split("/")[2]) ? pathname.split("/")[2] : "";

    const queryClient = new QueryClient();

    var supportDialog = {
        isActive: supportDialogIsActive,
        setIsActive: supportDialogSetIsActive
    };

    const { t, i18n } = useTranslation();

    const [currentPaymentMethod, setCurrentPaymentMethod] = useState(null);
    const [currentPaymentInstrument, setCurrentPaymentInstrument] = useState(null);

    const [cardNumberLast4, setCardNumberLast4] = useCookie("last4", null);
    const [traderData, setTraderData] = useCookie("traderData", null);
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

    const getLangsForHeader = langs => {
        langs = langs.filter(item => {
            return item !== lang;
        });
        return langs;
    };

    let langs = getLangsForHeader(navigator.languages);

    var fingerprintConfig; /* = {
        headers: {
            "X-Fingerprint": fingerprint,
            "Accept-Language": [lang, ...langs].toString()
        }
    }; */

    useEffect(() => {
        fingerprintConfig = {
            headers: {
                "X-Fingerprint": fingerprint,
                "Accept-Language": [lang, ...langs].toString()
            }
        };

        console.log("fingerprintConfig: ", fingerprintConfig);
    }, [, fingerprint, /* customerId, */ lang]);

    useEffect(() => {
        let fp = `${getBrowserFingerprint({
            hardwareOnly: true,
            enableScreen: false /* , enableWebgl: true */
        })}`;
        setFingerprint(fp);

        setFingerprintReady(true);
    }, []);

    useEffect(() => {
        setCookie("CurrentPaymentMethod", JSON.stringify(currentPaymentMethod));
    }, [currentPaymentMethod]);

    useEffect(() => {
        setCookie("CurrentPaymentInstrument", JSON.stringify(currentPaymentInstrument));
    }, [currentPaymentInstrument]);

    const resetCookies = () => {
        setCardNumberLast4(null);
        setTraderData(null);
    };

    const getCurrencySymbol = code => {
        if (CurrencyLibrary.hasOwnProperty(code)) {
            return CurrencyLibrary[code].symbol_native;
        }
        return code;
    };

    return (
        <QueryClientProvider client={queryClient}>
            <AppContext.Provider
                value={{
                    navigate,
                    supportDialog,
                    currentPaymentMethod,
                    setCurrentPaymentMethod,
                    currentPaymentInstrument,
                    setCurrentPaymentInstrument,
                    cardNumberLast4,
                    setCardNumberLast4,
                    traderData,
                    setTraderData,
                    resetCookies,
                    t,
                    fingerprintConfig,
                    getCurrencySymbol,
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
            </AppContext.Provider>
        </QueryClientProvider>
    );
};

export default AppContext;
