import Header from "../widgets/Header";
import Footer from "../widgets/Footer";
import Clock from "../shared/assets/images/clock.svg";
import { useContext } from "react";
import AppContext from "../AppContext";
import PlusCircle from "../shared/assets/images/plus-circle.svg";
import Timer from "../shared/ui/Timer";

// eslint-disable-next-line react/prop-types
export const GeneralErrorPage = ({ cancel = false }) => {
    const { t, BFData, ym } = useContext(AppContext);

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const failUrl = BFData?.[dest]?.method?.context?.error_redirect_url;
    const cancelUrl = BFData?.[dest]?.method?.context?.cancel_redirect_url;

    //translation
    const ns = { ns: ["Common", "GeneralError"] };

    const returnCallback = () => {
        ym("reachGoal", "fail-return-button", { cancel_url: cancelUrl, fail_url: failUrl });
        window.location.replace(cancel && cancelUrl ? cancelUrl : failUrl);
    };

    return (
        <div className="container">
            <Header />

            <div className="content">
                <div className="header-container grow">
                    <h1>{t(cancel ? "cancelPage.cancel" : "error", ns)}</h1>
                </div>
                <div className="description low-mb low-mt">
                    <p>{t(cancel ? "cancelPage.transactionCanceled" : "pleaseRepeatOrder", ns)}</p>
                </div>

                <img className="error-image" src={PlusCircle} alt="" />

                {(failUrl || (cancelUrl && cancel)) && (
                    <>
                        <p>{t("timerText", ns)}</p>
                        <div className="deadline-container">
                            <img src={Clock} alt="" />
                            <Timer
                                down={true}
                                className="deadline-timer"
                                secondsToDo={5}
                                timerCallback={() => window.location.replace(cancel && cancelUrl ? cancelUrl : failUrl)}
                            />
                        </div>
                    </>
                )}
            </div>

            <Footer
                buttonCaption={t("returnBtn", ns)}
                buttonCallback={returnCallback}
                nextPage={cancel && cancelUrl ? cancelUrl : failUrl}
                nextEnabled={cancel && cancelUrl ? cancelUrl : failUrl}
                noIcon={true}
                showCancelBtn={false}
            />
        </div>
    );
};

export default GeneralErrorPage;
