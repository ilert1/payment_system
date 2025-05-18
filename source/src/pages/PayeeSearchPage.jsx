import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { ProgressSteper } from "../widgets/ProgressSteper";

import usePaymentPage from "../hooks/usePaymentPage.jsx";

const PayeeSearchPage = () => {
    const { BFData, currentPaymentInstrument, t, getCurrencySymbol } = useContext(AppContext);

    usePaymentPage({ absolutePath: false });

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

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

    return (
        <div className="container">
            <Header />

            <div className="content">
                <h1 className="grow">
                    {t("lookingFor", ns)} {BFData?.[dest]?.amount}&nbsp;
                    {getCurrencySymbol(BFData?.[dest]?.currency)} {t("via", ns)} {currentPaymentInstrument?.bank_name}
                </h1>
                <ProgressSteper step={step} />
            </div>

            <Footer buttonCaption={t("approve", ns)} approve={true} />
        </div>
    );
};

export default PayeeSearchPage;
