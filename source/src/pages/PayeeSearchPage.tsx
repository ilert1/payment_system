import { useEffect, useState } from "react";
import { useAppContext } from "@/AppContext";
import usePaymentPage from "@/hooks/usePaymentPage";
import { useBFStore } from "@/shared/store/bfDataStore";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";
import { ProgressSteper } from "@/widgets/ProgressSteper";

const PayeeSearchPage = () => {
    const { currentPaymentInstrument, t, getCurrencySymbol } = useAppContext();
    const BFData = useBFStore(state => state.BFData);

    usePaymentPage({ absolutePath: false });

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    //translation
    const ns = { ns: ["Common", "PayeeSearch"] };

    const [step, setStep] = useState(1);

    let stepperInterval: NodeJS.Timeout | undefined = undefined;
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
        <Page>
            <div className="content">
                <h1 className="grow">
                    {t("lookingFor", ns)} {BFData?.[dest]?.amount}&nbsp;
                    {getCurrencySymbol(BFData?.[dest]?.currency ?? "")} {t("via", ns)}{" "}
                    {currentPaymentInstrument?.data?.bank_name}
                </h1>
                <ProgressSteper step={step} />
            </div>

            <Footer buttonCaption={t("approve", ns)} approve={true} />
        </Page>
    );
};

export default PayeeSearchPage;
