import { useEffect, useState } from "react";
import { useAppContext } from "@/AppContext";
import { usePaymentPage } from "@/shared/hooks/usePaymentPage";
import { useFooterStore } from "@/shared/store/FooterStore/slice/FooterSlice";
import { useBFStore } from "@/shared/store/bfDataStore";
import { Heading } from "@/shared/ui/Heading/Heading";
import { Content } from "@/widgets/Content";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";
import { ProgressSteper } from "@/widgets/ProgressSteper";

const PayeeSearchPage = () => {
    const { currentPaymentInstrument, t, getCurrencySymbol } = useAppContext();
    const BFData = useBFStore(state => state.BFData);
    const setFooter = useFooterStore(state => state.setFooter);

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

    useEffect(() => {
        setFooter({
            buttonCaption: t("approve", ns),
            approve: true,
            isUnicalization: false
        });
    }, []);

    return (
        <Page>
            <Content>
                <Heading
                    size="l"
                    title={
                        t("lookingFor", ns) +
                        BFData?.[dest]?.amount +
                        "\u00A0" +
                        getCurrencySymbol(BFData?.[dest]?.currency ?? "") +
                        t("via", ns) +
                        " " +
                        currentPaymentInstrument?.data?.bank_name
                    }
                />
                <ProgressSteper step={step} />
            </Content>

            <Footer />
        </Page>
    );
};

export default PayeeSearchPage;
