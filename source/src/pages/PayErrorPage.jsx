// import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext } from "react";
import Clock from "../assets/images/clock.svg";
import AppContext from "../AppContext";
import PlusCircle from "../assets/images/plus-circle.svg";
import Timer from "../ui/Timer";

const PayErrorPage = (notFound = false) => {
    const { t, BFData } = useContext(AppContext);

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const failUrl = BFData?.[dest]?.method?.context?.error_redirect_url;

    //translation
    const ns = { ns: "PayError" };

    return (
        <div className="container">
            <Header />

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

                <>
                    <p>{t("timerText", ns)}</p>
                    <div className="deadline-container">
                        <img src={Clock} alt="" />
                        <Timer down={true} className="deadline-timer" secondsToDo={5} />
                    </div>
                </>
            </div>

            <Footer
                buttonCaption={t("returnBtn", ns)}
                buttonCallback={() => window.location.replace(failUrl)}
                // payeeCard={!notFound && true}
                nextPage={failUrl}
                nextEnabled={failUrl}
                noIcon={true}
                showCancelBtn={false}
            />
        </div>
    );
};

export default PayErrorPage;
