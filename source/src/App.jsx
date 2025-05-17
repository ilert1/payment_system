import * as c from "./assets/constants.js";
import "./assets/css/fonts.css";
import "./assets/css/styles.css";

import PaymentInstrumentPage from "./pages/PaymentInstrumentPage";
import PayerDataPage from "./pages/PayerDataPage";
import PayeeSearchPage from "./pages/PayeeSearchPage";
import PayPage from "./pages/PayPage";
import PayeeDataPage from "./pages/PayeeDataPage";
import SuccessPage from "./pages/SuccessPage";
import PayErrorPage from "./pages/PayErrorPage";
import GeneralErrorPage from "./pages/GeneralErrorPage";
import PaymentConfirmationPage from "./pages/PaymentConfirmationPage";
import PaymentWaitConfirmation from "./pages/PaymentWaitConfirmation";
import PaymentMethodsPage from "./pages/PaymentMethodsPage.jsx";
import MainPage from "./pages/MainPage.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import AppContext from "./AppContext.jsx";
import Loader from "./ui/Loader.jsx";
import axios from "axios";
import { ToastContainer } from "react-toastify";

const defaultPages = [
    {
        path: c.PAGE_PAYMENT_METHODS, // "/payment-methods",
        element: <PaymentMethodsPage />
    },
    {
        path: c.PAGE_PAYMENT_INSTRUMENT, //"/payment-instrument-page",
        element: <PaymentInstrumentPage />
    },
    {
        path: c.PAGE_PAYER_DATA, //"/payer-data-page",
        element: <PayerDataPage />
    },
    {
        path: c.PAGE_PAYEE_SEARCH, //"/payee-search-page",
        element: <PayeeSearchPage />
    },
    {
        path: c.PAGE_PAY, //"/pay-page",
        element: <PayPage />
    },
    {
        path: c.PAGE_PAYEE_DATA, //"/payee-data-page",
        element: <PayeeDataPage />
    },
    {
        path: c.PAGE_SUCCESS, //"/success-page",
        element: <SuccessPage />
    },
    {
        path: c.PAGE_PAY_ERROR, // payment-fault "/pay-error-page",
        element: <PayErrorPage />
    },
    {
        path: c.PAGE_PAYMENT_CONFIRMATION, //"/payment-confirmation-page",
        element: <PaymentConfirmationPage />
    },
    {
        path: c.PAGE_PAYMENT_WAIT_CONFIRMATION, //"/payment-wait-confirmation",
        element: <PaymentWaitConfirmation />
    },
    {
        path: c.PAGE_GENERAL_ERROR, //"/general-error-page",
        element: <GeneralErrorPage />
    },
    {
        path: c.PAGE_CANCEL, //"/cancel-page",
        element: <GeneralErrorPage cancel={true} />
    }
];

const router = createBrowserRouter([
    {
        path: `/payments/:blowfishId/`, //${c.PAGE_MAIN} //"/",
        children: [
            ...defaultPages,
            {
                index: true,
                element: <MainPage />
            }
        ]
    },
    {
        path: `/payouts/:blowfishId/`,
        children: [
            ...defaultPages,
            {
                // path: c.PAGE_OUT_PAY, //"/pay-out-page",
                index: true,
                element: <MainPage />
            }
        ]
    },
    {
        path: c.PAGE_PAYMENT_NOT_FOUND,
        element: <PayErrorPage notFound={true} />
    },
    {
        path: c.PAGE_PAYOUT_NOT_FOUND,
        element: <PayErrorPage notFound={true} />
    },
    {
        path: c.PAGE_GENERAL_ERROR,
        element: <GeneralErrorPage />
    },
    {
        path: "*",
        element: <PayErrorPage notFound={true} />
    }
]);

const App = () => {
    const { setBFData, BFData, setCurrentPaymentMethod, fingerprintConfig, payoutMode } = useContext(AppContext);

    // получаем BFID из URL
    let pathname = new URL(window.location.href).pathname;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const blowfishId = uuidRegex.test(pathname.split("/")[2]) ? pathname.split("/")[2] : "";
    const notFound = pathname.indexOf("not-found") >= 0;

    let storedCurrentPaymentMethod = localStorage.getItem("CurrentPaymentMethod");
    useEffect(() => {
        if (storedCurrentPaymentMethod) {
            setCurrentPaymentMethod(JSON.parse(storedCurrentPaymentMethod));
        }
    }, []);

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const baseApiURL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (BFData?.payout?.id || BFData?.payment?.id) {
            const mode = payOutMode ? "payout" : "payment";

            const es = new EventSource(`${baseApiURL}/${dest}s/${BFData?.[mode]?.id}/events`);

            es.onopen = () => console.log(">>> Connection opened!");

            es.onerror = e => console.log("ERROR!", e);

            es.onmessage = async e => {
                try {
                    const resEventData = JSON.parse(e.data);
                    console.log("SSE: ", resEventData);

                    const tempBFData = { ...BFData };
                    tempBFData[mode].status = resEventData.data.status;

                    setBFData(tempBFData);
                } catch (error) {
                    // continue
                }
            };

            return () => es.close();
        }
    }, [BFData?.payout?.id, BFData?.payment?.id]);

    const { isFetching: isFetching_Blowfish } = useQuery({
        queryKey: ["exist"],
        refetchInterval: BFData?.[dest]?.status === "paymentAwaitingStart" ? 1000 : false,
        enabled: Boolean(blowfishId) && !notFound,
        // refetchIntervalInBackground: true,
        // retry: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            if (blowfishId) {
                let dest = payoutMode ? "payouts" : "payments";

                try {
                    const { data } = await axios.get(
                        `${import.meta.env.VITE_API_URL}/${dest}/${blowfishId}`,
                        fingerprintConfig
                    );

                    console.log(data);

                    if (data) {
                        if (data?.success) {
                            //данные получены успешно
                            setBFData(data);
                        } else {
                            //транзакция не найдена или не подлежит оплате
                            console.log(data?.error);
                            window.location.replace(
                                `/${payoutMode ? c.PAGE_PAYOUT_NOT_FOUND : c.PAGE_PAYMENT_NOT_FOUND}`
                            );
                        }
                    }
                    return data;
                } catch (e) {
                    console.error(e.response.statusCode);
                    if (e.response.statusCode === 404) {
                        window.location.replace(`/${payoutMode ? c.PAGE_PAYOUT_NOT_FOUND : c.PAGE_PAYMENT_NOT_FOUND}`);
                    }
                }
            }
        }
    });

    return (
        <>
            {isFetching_Blowfish ? (
                <div className="container">
                    <div className="content">
                        <div className="loader-container">
                            <Loader />
                        </div>
                    </div>
                </div>
            ) : (
                <RouterProvider router={router} />
            )}
            <ToastContainer />
        </>
    );
};

export default App;
