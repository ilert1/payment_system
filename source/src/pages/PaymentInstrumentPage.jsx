import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { PayInstruments } from "../widgets/PayInstruments.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const PaymentInstrumentPage = () => {
    const {
        navigate,
        paymentEcomPage,
        currentPaymentInstrument,
        fingerprintConfig,
        getCurrencySymbol,
        fingerprintReady,
        BFData,
        t
    } = useContext(AppContext);

    //translation
    const ns = { ns: ["Common", "PaymentInstrument"] };

    const [paymentInstruments, setPaymentInstruments] = useState(null);
    const [enabled_startPayIN, setEnabled_startPayIN] = useState(false);

    const nav = navigate();

    useEffect(() => {
        const paymentPage = paymentEcomPage();

        if (paymentPage && !window.location.pathname.includes(paymentPage)) {
            nav("../" + paymentPage, { replace: true });
        }
    }, [nav, paymentEcomPage]);

    /* console.log(`VITE_API_URL: ${import.meta.env.VITE_API_URL}`);
    console.log(`MODE: ${import.meta.env.MODE}`); */

    const { data, isFetching } = useQuery({
        queryKey: ["getPaymentInstruments"],
        refetchOnWindowFocus: false,
        retry: true,
        enabled: fingerprintReady,
        queryFn: async () => {
            console.log("getPaymentInstruments");
            let payload = BFData;
            const { dir, prov, trn, wf, currency, merchantId } = payload;
            payload = {
                dir: dir,
                prov: prov,
                trn: trn,
                wf: wf,
                currency: currency,
                merchantId: merchantId
            };

            console.log("getPaymentInstruments payload:");
            console.log(payload);

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/getPaymentMethods`, // todo: will change?
                payload,
                fingerprintConfig
            );
            console.log("getPaymentInstruments response:");
            console.log(data);
            setPaymentInstruments(data?.data?.payment_instruments);
            return data;
        },
        onError: () => {
            console.log("getPaymentInstruments error");
        }
    });

    const { data: data_startPayIN, isFetching: isFetching_startPayIN } = useQuery({
        queryKey: ["startPayIN"],
        enabled: enabled_startPayIN && fingerprintReady,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            console.log("startPayIN");
            let payload = BFData;
            const { trn } = payload;
            payload = {
                message: {
                    payment: {
                        bank: currentPaymentInstrument?.bank,
                        trn: trn,
                        type: currentPaymentInstrument?.payment_type //"card2card",
                        // wf: wf
                    }
                }
            };

            console.log("startPayIN payload:");
            console.log(payload);

            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/startPayIN`, payload, fingerprintConfig);

            console.log("startPayIN response:");
            console.log(data);

            nav(c.PAGE_PAYER_DATA, { replace: true });
            return data;
        }
    });

    const buttonCallback = () => {
        setEnabled_startPayIN(true);
    };

    return (
        <div className="container">
            <Header />
            <div className="content">
                <h1>{t("amount", ns)}</h1>
                <div className="amount-container">
                    <p className="amount">{BFData?.amount}</p>
                    <p className="currency">&nbsp;{getCurrencySymbol(BFData?.currency)}</p>
                </div>
                <PayInstruments isFetching={isFetching} paymentInstruments={paymentInstruments} />
            </div>

            <Footer
                buttonCaption={t("next", ns)}
                buttonCallback={buttonCallback}
                nextPage={`/${BFData?.blowfish_id}/${c.PAGE_PAYER_DATA}`}
                // prevPage={c.PAGE_MAIN}
                nextEnabled={!isFetching_startPayIN && currentPaymentInstrument != null ? true : false}
            />
        </div>
    );
};

export default PaymentInstrumentPage;
