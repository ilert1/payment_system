import Header from "../widgets/Header";
import Footer from "../widgets/Footer";
import Clock from "../shared/assets/images/clock.svg?react";
import usePaymentPage from "../hooks/usePaymentPage";
import Timer from "../shared/ui/Timer";
import { useAppContext } from "../AppContext";
import { useBFStore } from "@/shared/store/bfDataStore";

const SuccessPage = () => {
    const { t, getCurrencySymbol, payoutMode, status, ym } = useAppContext();
    const BFData = useBFStore(state => state.BFData);

    //translation
    const ns = { ns: "Success" };

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const successUrl = BFData?.[dest]?.method?.context?.success_redirect_url ?? "";

    usePaymentPage({ absolutePath: false });

    const successCallback = () => {
        ym("reachGoal", "success-return-button", { success_url: successUrl });
        window.location.replace(successUrl);
    };

    return (
        <div className="container">
            <Header />

            <div className="content">
                <div className="header-container grow wide center">
                    <h1>{t(payoutMode ? "payoutHeader" : "header", ns)}</h1>
                    <p className="amount">
                        + {BFData?.[dest]?.amount} {getCurrencySymbol(BFData?.[dest]?.currency ?? "")}
                    </p>
                </div>

                {successUrl && (
                    <>
                        <p>{t("timerText", ns)}</p>
                        <div className="deadline-container">
                            <Clock />
                            <Timer
                                down={true}
                                className="deadline-timer"
                                secondsToDo={5}
                                timerCallback={successCallback}
                            />
                        </div>
                    </>
                )}
            </div>

            <Footer
                buttonCaption={t("returnBtn", ns)}
                buttonCallback={() => window.location.replace(successUrl)}
                nextPage={successUrl}
                nextEnabled={Boolean(successUrl)}
                noIcon={true}
                showCancelBtn={false}
            />
        </div>
    );
};

export default SuccessPage;
