import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { ProgressSteper } from "../widgets/ProgressSteper";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import usePaymentPage from "../hooks/usePaymentPage.jsx";

const PayeeSearchPage = () => {
    const {
        navigate,
        BFData,
        cardNumberLast4,
        currentPaymentInstrument,
        setTraderData,
        fingerprintConfig,
        fingerprintReady,
        t,
        getCurrencySymbol
    } = useContext(AppContext);

    const nav = navigate();

    usePaymentPage({ absolutePath: false });

    //translation
    const ns = { ns: ["Common", "PayeeSearch"] };

    const [step, setStep] = useState(1);

    let stepperInterval;
    let stepperInterval_seconds = 0;

    useEffect(() => {
        stepperInterval = setInterval(() => {
            stepperInterval_seconds++;
            if (stepperInterval_seconds >= 10) {
                setStep(3);
                clearInterval(stepperInterval);
            } else {
                if (stepperInterval_seconds >= 3) {
                    setStep(2);
                }
            }
        }, 1000);
    }, []);

    const { data: data_TraderData, isFetching: isFetching_TraderData } = useQuery({
        queryKey: ["getTraderData"],
        enabled: fingerprintReady,
        /* refetchInterval: 1000,
        refetchIntervalInBackground: true, */
        retry: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            console.log("getTraderData");
            let payload = BFData;
            const { trn } = payload;
            payload = {
                trn: trn
            };
            console.log("getTraderData payload:");
            console.log(payload);

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/getTraderData`,
                payload,
                fingerprintConfig
            );

            console.log("getTraderData response:");
            console.log(data);

            if (data?.success) {
                if (data?.data?.card || data?.data?.phone) {
                    setTraderData(JSON.stringify(data?.data));
                    nav(`../${c.PAGE_PAY}`, { replace: true });
                }
            } else {
                if (BFData?.fail_url) {
                    window.location.replace(BFData.fail_url);
                } else {
                    nav(c.PAGE_GENERAL_ERROR, { replace: true });
                }
            }
            return data;
        }
    });

    return (
        <div className="container">
            <Header />

            <div className="content">
                <h1 className="grow">
                    {t("lookingFor", ns)} {BFData?.amount}&nbsp;
                    {getCurrencySymbol(BFData?.currency)} {t("via", ns)} {currentPaymentInstrument?.bank_name}
                </h1>
                <ProgressSteper step={step} />
            </div>

            <Footer buttonCaption={t("approve", ns)} approve={true} />
        </div>
    );
};

export default PayeeSearchPage;
