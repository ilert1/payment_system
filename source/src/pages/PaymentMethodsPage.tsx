// TODO

import Header from "../widgets/Header.jsx";
import Footer from "../widgets/Footer.jsx";

import { useState } from "react";
import { useAppContext } from "../AppContext.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PaymentMethodsList } from "../widgets/PaymentMethodsList.js";
import usePaymentPage from "@/hooks/usePaymentPage";
import { AppRoutes } from "@/shared/const/router.js";
import { useBFStore } from "@/shared/store/bfDataStore.js";

const PaymentMethodsPage = () => {
    const {
        currentPaymentMethod,
        getCurrencySymbol,
        fingerprintReady,
        fingerprintConfig,
        t,

        setFailUrlParams
    } = useAppContext();
    const BFData = useBFStore(state => state.BFData);

    usePaymentPage({ absolutePath: false });

    //translation
    const ns = { ns: ["Common", "PaymentInstrument"] };

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[] | null>(null);

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const baseApiURL = import.meta.env.VITE_API_URL;

    const buttonCallback = async () => {
        if (currentPaymentMethod?.payment_type) {
            const { data } = await axios
                .post(
                    `${baseApiURL}/${dest}s/${BFData?.[dest]?.id}/events`,
                    {
                        event: "paymentMethodSelected",
                        method: {
                            name: currentPaymentMethod?.payment_type
                        }
                    },
                    fingerprintConfig
                )
                .catch(e => {
                    console.log(e);
                });
            console.log(data);
        }
    };

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

            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/${BFData?.blowfish_id}/payment-methods`,
                fingerprintConfig
            );

            /* const data = { //TODO: удалить мок
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
            }; */

            console.log("payment-methods response:");
            console.log(data);

            setPaymentMethods(data?.data?.payment_methods); //
            return data;
        },
        onError: e => {
            //TODO: актуализировать обработчик при ошибке
            if (e?.status_code === 404 || e?.status_code === 500) {
                let details = e.response?.error?.details;
                let message = e.response?.error?.message;

                /* redirectUrl = `${BFData?.fail_url}?blowfishId=${BFData?.blowfish_id}${
                    message ? `&message=${base58(message)}` : ""
                }${details ? `&details=${base58(details)}` : ""}`;
                setFailUrlParams(redirectUrl);
                location.href.replace(redirectUrl); */
            }
        }
    });

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
                <PaymentMethodsList isFetching={isFetching} paymentMethods={paymentMethods} />
            </div>

            <Footer
                buttonCaption={t("next", ns)}
                buttonCallback={buttonCallback}
                nextPage={
                    currentPaymentMethod?.bank_name || currentPaymentMethod?.payment_type == "sbp"
                        ? `/${BFData?.blowfish_id}/${AppRoutes.PAYER_DATA_PAGE}`
                        : `/${BFData?.blowfish_id}/${AppRoutes.PAYMENT_INSTRUMENT}`
                }
                nextEnabled={!isFetching && currentPaymentMethod != null ? true : false}
            />
        </div>
    );
};

export default PaymentMethodsPage;
