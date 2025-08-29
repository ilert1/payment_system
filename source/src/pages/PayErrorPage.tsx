import { useTranslation } from "react-i18next";
import { useAppContext } from "@/AppContext";
import Clock from "@/shared/assets/images/clock.svg";
import PlusCircle from "@/shared/assets/images/plus-circle.svg";
import { useBFStore } from "@/shared/store/bfDataStore";
import Timer from "@/shared/ui/Timer";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";

const PayErrorPage = ({ notFound = false }) => {
    const { ym } = useAppContext();

    const { t } = useTranslation();
    const BFData = useBFStore(state => state.BFData);

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const failUrl = BFData?.[dest]?.method?.context?.error_redirect_url ?? "";

    ym("reachGoal", notFound ? "payment-not-found" : "pay-error-page");

    const buttonCallback = () => {
        ym("reachGoal", "fail-return-button", { fail_url: failUrl });
        if (failUrl) window.location.replace(failUrl);
    };

    //translation
    const ns = { ns: "PayError" };

    return (
        <Page>
            <div className="content">
                <div className="header-container grow">
                    {!notFound ? <h1>{t("payError", ns)}</h1> : <h1>{t("notFound", ns)}</h1>}
                </div>
                <div className="description low-mb low-mt">
                    {!notFound ? <p>{t("pleaseRepeatOrder", ns)}</p> : <p>{t("pleaseRepeatOrSupport", ns)}</p>}
                </div>
                <img className="error-image" src={PlusCircle} alt="" />

                {failUrl && (
                    <>
                        <p>{t("timerText", ns)}</p>
                        <div className="deadline-container">
                            <img src={Clock} alt="" />
                            <Timer
                                down={true}
                                className="deadline-timer"
                                secondsToDo={5}
                                timerCallback={() => window.location.replace(failUrl)}
                            />
                        </div>
                    </>
                )}
            </div>

            <Footer
                buttonCaption={t("returnBtn", ns)}
                buttonCallback={buttonCallback}
                nextPage={failUrl}
                nextEnabled={!!failUrl}
                noIcon={true}
                showCancelBtn={false}
            />
        </Page>
    );
};

export default PayErrorPage;
