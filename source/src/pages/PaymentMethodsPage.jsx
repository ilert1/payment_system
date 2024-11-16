import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext, useEffect, useState } from "react";
import { AppContext, base58 } from "../AppContext";
// import { PayMethod } from "../widgets/PayInstrument.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PaymentMethodsList } from "../widgets/PaymentMethodsList.jsx";
import { useNavigate } from "react-router-dom";
// import { base58_to_binary, binary_to_base58 } from "base58-js";

const PaymentMethodsPage = () => {
    const {
        navigate,
        setCurrentPaymentMethod,
        currentPaymentMethod,
        paymentEcomPage,
        getCurrencySymbol,
        fingerprintReady,
        t,
        BFData,
        setFailUrlParams
    } = useContext(AppContext);

    const nav = navigate();

    useEffect(() => {
        const paymentPage = paymentEcomPage();

        if (paymentPage && !window.location.pathname.includes(paymentPage)) {
            nav("../" + paymentPage, { replace: true });
        }
    }, [nav, paymentEcomPage]);

    //translation
    const ns = { ns: ["Common", "PaymentInstrument"] };

    const [paymentMethods, setPaymentMethods] = useState(null);

    /* console.log(`VITE_API_URL: ${import.meta.env.VITE_API_URL}`);
    console.log(`MODE: ${import.meta.env.MODE}`);

    console.log(BFData); */

    let redirectUrl;

    const { data, isFetching, isError } = useQuery({
        queryKey: ["payment-methods"],
        refetchOnWindowFocus: false,
        retry: true,
        throwOnError: true,
        // enabled: !!fingerprintConfig?.headers["X-Fingerprint"],
        enabled: fingerprintReady || BFData?.blowfish_id,
        queryFn: async () => {
            console.log("payment-methods");

            // try {
            /* const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/${BFData?.blowfish_id}/payment-methods`,
                fingerprintConfig
            ); */
            // .catch();

            const data = {
                data: {
                    payment_methods: [
                        {
                            method_id: 0,
                            method_logo: "/src/assets/images/Sberbank_Logo_2020.svg",
                            bank_name: "Сбербанк",
                            method_name: "Сбербанк",
                            payment_type: "card2card"
                        },
                        {
                            method_id: 1,
                            method_logo: "/src/assets/images/sbp-logo.svg",
                            method_name: "СБП",
                            payment_type: "sbp"
                        },
                        {
                            method_id: 2,
                            method_logo: "/src/assets/images/bank-icon.svg",
                            method_name: "По номеру карты",
                            payment_type: "card2card"
                        }
                    ]
                }
            };
            console.log("payment-methods response:");
            console.log(data);

            setPaymentMethods(data?.data?.payment_methods); //
            return data;
        },
        onError: e => {
            if (e?.status_code === 404 || e?.status_code === 500) {
                let details = e.response?.error?.details;
                let message = e.response?.error?.message;

                //${c.PAGE_PAYMENT_NOT_FOUND}
                redirectUrl = `${BFData?.fail_url}?blowfishId=${BFData?.blowfish_id}${
                    message ? `&message=${base58(message)}` : ""
                }${details ? `&details=${base58(details)}` : ""}`;
                // console.log(e);
                // console.log(redirectUrl);
                setFailUrlParams(redirectUrl);
                location.href.replace(redirectUrl);
                // navigate(redirectUrl, { replace: true });
                // console.log("payment-methods error");
            }
        }
    });

    /* useEffect(() => {
        if (isError) {
            location.href.replace(redirectUrl);
        }
    }, [isError]); */

    /* const buttonCallback = () => {
        setEnabled_startPayIN(true);
    }; */

    // console.log(currentPaymentMethod);
    console.log(BFData);
    console.log(
        currentPaymentMethod?.bank_name || currentPaymentMethod?.payment_type == "sbp"
            ? `/${BFData?.blowfish_id}/${c.PAGE_PAYER_DATA}`
            : `/${BFData?.blowfish_id}/${c.PAGE_PAYMENT_INSTRUMENT}`
    );

    return (
        <div className="container">
            <Header />
            <div className="content">
                <h1>{t("amount", ns)}</h1>
                <div className="amount-container">
                    <p className="amount">{BFData?.amount}</p>
                    <p className="currency">&nbsp;{getCurrencySymbol(BFData?.currency)}</p>
                </div>
                <PaymentMethodsList
                    isFetching={isFetching}
                    paymentMethods={paymentMethods}
                    // currentPaymentMethod={currentPaymentMethod}
                    // setCurrentPaymentMethod={setCurrentPaymentMethod}
                />
            </div>

            <Footer
                buttonCaption={t("next", ns)}
                // buttonCallback={buttonCallback}
                nextPage={
                    currentPaymentMethod?.bank_name || currentPaymentMethod?.payment_type == "sbp"
                        ? `/${BFData?.blowfish_id}/${c.PAGE_PAYER_DATA}`
                        : `/${BFData?.blowfish_id}/${c.PAGE_PAYMENT_INSTRUMENT}`
                }
                // prevPage={c.PAGE_MAIN}
                nextEnabled={!isFetching && currentPaymentMethod != null ? true : false}
            />
        </div>
    );
};

export default PaymentMethodsPage;
