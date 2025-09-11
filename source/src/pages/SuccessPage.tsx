import { useAppContext } from "@/AppContext";
import usePaymentPage from "@/hooks/usePaymentPage";
import { useBFStore } from "@/shared/store/bfDataStore";
import { DeadLineTimer } from "@/shared/ui/DeadlineTimer/DeadLineTimer";
import { Heading } from "@/shared/ui/Heading/Heading";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";

const SuccessPage = () => {
    const { t, getCurrencySymbol, payoutMode, ym } = useAppContext();
    ym("reachGoal", "success-page");
    const BFData = useBFStore(state => state.BFData);

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
                    <Heading align="center" size="l" title={t(payoutMode ? "payoutHeader" : "header", ns)} />

                    <p className="amount">
                        + {BFData?.[dest]?.amount} {getCurrencySymbol(BFData?.[dest]?.currency ?? "")}
                    </p>
                </div>

                {successUrl && (
                    <>
                        <p>{t("timerText", ns)}</p>
                        <DeadLineTimer timerSecondsTo={5} timerCallback={successCallback} />
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
