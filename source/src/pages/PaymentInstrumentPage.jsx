import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext, useState } from "react";
import AppContext from "../AppContext";
import { PayInstruments } from "../widgets/PayInstruments.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import usePaymentPage from "../hooks/usePaymentPage.jsx";

const PaymentInstrumentPage = () => {
    const { currentPaymentInstrument, fingerprintConfig, getCurrencySymbol, fingerprintReady, BFData, t } =
        useContext(AppContext);

    //translation
    const ns = { ns: ["Common", "PaymentInstrument"] };

    const [paymentInstruments, setPaymentInstruments] = useState(null);
    const [instrumentSelectedEnable, setInstrumentSelectedEnable] = useState(false);

    usePaymentPage({ absolutePath: false });

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const baseApiURL = import.meta.env.VITE_API_URL;

    const { data, isFetching } = useQuery({
        queryKey: ["getPaymentInstruments"],
        refetchOnWindowFocus: false,
        retry: true,
        enabled: fingerprintReady,
        queryFn: async () => {
            console.log("send event: paymentPayerGetInstruments");
            const payload = {
                paymentId: BFData?.[dest]?.id,
                event: "paymentPayerGetInstruments"
            };

            console.log("paymentPayerGetInstruments payload:");
            console.log(payload);

            const { data } = await axios.post(
                `${baseApiURL}/${dest}s/${BFData?.[dest]?.id}/events`,
                payload,
                fingerprintConfig
            );

            console.log("paymentPayerGetInstruments response:");
            console.log(data);
            setPaymentInstruments(data?.data?.payment_instruments);
            return data;
        },
        onError: () => {
            console.log("paymentPayerGetInstruments error");
        }
    });

    const { instrumentSelected_isFetching } = useQuery({
        queryKey: ["paymentPayerSelectedInstrument"],
        refetchOnWindowFocus: false,
        retry: true,
        enabled: instrumentSelectedEnable && fingerprintReady,
        queryFn: async () => {
            console.log("send event: paymentPayerSelectedInstrument");
            if (currentPaymentInstrument?.data?.bank) {
                const payload = {
                    bank: currentPaymentInstrument?.data?.bank,
                    payment_type: currentPaymentInstrument?.data?.payment_type
                };

                console.log("paymentPayerSelectedInstrument payload:");
                console.log(payload);

                const { data } = await axios
                    .post(
                        `${baseApiURL}/${dest}s/${BFData?.[dest]?.id}/events`,
                        {
                            paymentId: BFData?.[dest]?.id,
                            event: "paymentPayerSelectedInstrument",
                            payload: payload
                        },
                        fingerprintConfig
                    )
                    .catch(e => {
                        console.log(e);
                    });
                console.log(data);
                return data;
            }
        },
        onError: () => {
            console.log("paymentBankSelected error");
        }
    });

    const buttonCallback = async () => {
        setInstrumentSelectedEnable(true);
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
                nextEnabled={!instrumentSelected_isFetching && currentPaymentInstrument?.data != null ? true : false}
            />
        </div>
    );
};

export default PaymentInstrumentPage;
