import { useBFStore } from "@/shared/store/bfDataStore";
import { Page } from "@/widgets/Page";
import { useAppContext } from "../AppContext";
import usePaymentPage from "../hooks/usePaymentPage";
import Clock from "../shared/assets/images/clock.svg?react";
import Timer from "../shared/ui/Timer";
import { Footer } from "../widgets/Footer";

const SuccessPage = () => {
    const { t, getCurrencySymbol, payoutMode, ym } = useAppContext();
    ym("reachGoal", "success-page");
    const BFData = useBFStore(state => state.BFData);
    // const status = useBFStore(state => state.status);
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
        <Page>
            <div className="content">
                <div className="header-container grow wide center">
                    <h1 style={{ textAlign: "center" }}>{t(payoutMode ? "payoutHeader" : "header", ns)}</h1>
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
        </Page>
    );
};

export default SuccessPage;
