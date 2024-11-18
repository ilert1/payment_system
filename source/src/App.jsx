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
        path: c.PAGE_PAYMENT_NOT_FOUND,
        element: <PayErrorPage notFound={true} />
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
    /* {
        path: "/", //"/",
        // index: true,
        element: <MainPage />
    }, */
    /* {
        path: `/payer-data-page`,
        children: [
            ...defaultPages,
            {
                index: true,
                element: <PayerDataPage />
            }
        ]
    }, */
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
        path: `/payouts/${c.PAGE_PAYOUT_NOT_FOUND}`,
        element: <PayErrorPage notFound={true} />
    },
    {
        path: `/payments/${c.PAGE_PAYMENT_NOT_FOUND}`,
        element: <PayErrorPage notFound={true} />
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
        path: "*",
        element: <PayErrorPage notFound={true} />
    }
    /* {
        path: `/:blowfishId`, //${c.PAGE_MAIN} //"/",
        element: <MainPage />,
        elementError: <div>404</div>
    } */
]);

const App = () => {
    const { setBFData, BFData, setCurrentPaymentMethod, fingerprintConfig, payoutMode } = useContext(AppContext);

    // получаем BFID из URL
    let pathname = new URL(window.location.href).pathname;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const blowfishId = uuidRegex.test(pathname.split("/")[2]) ? pathname.split("/")[2] : "";
    const notFound = pathname.indexOf("not-found") >= 0;
    // const payMode = pathname.split("/")[1];

    /* // если отсутствует - сразу редиректим
    if (!blowfishId) {
        window.location.replace(payMode === "payouts" ? c.PAGE_PAYOUT_NOT_FOUND : c.PAGE_PAYMENT_NOT_FOUND);
    } */

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
        // refetchInterval: 1000,
        enabled: Boolean(blowfishId) && !notFound, //Boolean(blowfishId),
        // refetchIntervalInBackground: true,
        // retry: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            if (blowfishId) {
                let dest = payoutMode ? "payouts" : "payments";
                try {
                    const { data } = await axios
                        .get(`${import.meta.env.VITE_API_URL}/${dest}/${blowfishId}`, fingerprintConfig)
                        .catch(e => {
                            console.log(e);
                        });

                    /* const data = {
                        success: true,
                        payment: {
                            id: "2564dbd3-dc17-4713-8bd2-41c70dd9ef48",
                            amount: "992.00",
                            currency: "AZN",
                            method: {
                                name: "ecom",
                                display_name: "Банковский перевод",
                                payer: {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            card_cvc: {
                                                type: "string",
                                                description: "Card security code",
                                                format: ""
                                            },
                                            card_lifetime_month: {
                                                type: "string",
                                                description: "Card expiration date month",
                                                format: ""
                                            },
                                            card_lifetime_year: {
                                                type: "string",
                                                description: "Card expiration date year",
                                                format: ""
                                            },
                                            card_number: {
                                                type: "string",
                                                description: "Card number",
                                                format: ""
                                            }
                                        }
                                    },
                                    required: ["card_number", "card_lifetime_month", "card_lifetime_year", "card_cvc"],
                                    data: {
                                        card_cvc: "123",
                                        card_lifetime_month: "11",
                                        card_lifetime_year: "29",
                                        card_number: "4169738851576482"
                                    }
                                },
                                payee: {
                                    schema: {
                                        type: "",
                                        properties: null
                                    },
                                    required: null
                                    // redirect_url:
                                    //     "https://imap.inout-sarysu-az.icu/3ds-transaction?id=25135340&secret=a5289598b607ff1cd28f69c3cdf59bb3d02427be51d87c92dbe0f6ec1063953d"
                                },
                                context: {
                                    success_redirect_url: "https://merchant-side.com/success",
                                    error_redirect_url: "https://merchant-side.com/fail",
                                    cancel_redirect_url: "https://merchant-side.com/return"
                                }
                            },
                            // status: "paymentAwaitingStart",
                            status: "paymentPayerDataEntrу",
                            // status: "paymentAwaitingTransfer",
                            created_at: -62135596800
                        }
                    }; */

                    console.log(data);

                    if (data) {
                        if (data?.success) {
                            //данные получены успешно
                            setBFData(data);
                        } else {
                            //транзакция не подлежит оплате
                            window.location.replace(c.PAGE_PAYOUT_NOT_FOUND);
                        }
                    }
                    return data;
                } catch (e) {
                    console.error(e.response.statusCode);
                    if (e.response.statusCode === 404) {
                        window.location.replace(c.PAGE_PAYOUT_NOT_FOUND);
                    }
                }
            }

            //response mock
            // const data = {
            //     success: true,
            //     data: {
            //         id: "449bc546-e589-4aca-83fd-775099333842",
            //         blowfish_id: "01355e23-0eb6-446e-a4cc-4d403f789ee8",
            //         status: 1,
            //         amount: "1000.20",
            //         currency: "RUB",
            //         fail_url: "https://google.com",
            //         success_url: "",
            //         created_at: 1719389044819,
            //         die_at: 1719389944819
            //     }
            // };

            // data = null;
        }
    });

    /* useEffect(() => {
        setIsFetching_Blowfish(isFetching_Blowfish);
    }, [isFetching_Blowfish]);*/

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
