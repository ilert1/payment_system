import Header from "../widgets/Header";
import Footer from "../widgets/Footer";
import Clock from "../assets/images/clock.svg";
import { useContext } from "react";
import AppContext from "../AppContext";
import usePaymentPage from "../hooks/usePaymentPage";
import Timer from "../ui/Timer";

const SuccessPage = () => {
    const { BFData, t, getCurrencySymbol, payoutMode } = useContext(AppContext);

    //translation
    const ns = { ns: "Success" };

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const successUrl = BFData?.[dest]?.method?.context?.success_redirect_url;

    usePaymentPage({ absolutePath: false });

    return (
        <div className="container">
            <Header />

            <div className="content">
                <div className="header-container grow wide center">
                    <h1>{t(payoutMode ? "payoutHeader" : "header", ns)}</h1>
                    {BFData?.[dest]?.status && BFData?.[dest].status === "payoutPartiallyExecuted" ? (
                        <>
                            <p className="amount">
                                + {BFData?.[dest]?.lots.reduce((accum, curVal) => accum + Number(curVal.amount), 0)}{" "}
                                {getCurrencySymbol(BFData?.[dest]?.currency)}
                            </p>
                            <div className="instructions small">
                                <ul>
                                    <li>{t("instructions", ns)}</li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <p className="amount">
                            + {BFData?.[dest]?.amount} {getCurrencySymbol(BFData?.[dest]?.currency)}
                        </p>
                    )}
                </div>

                {successUrl && (
                    <>
                        <p>{t("timerText", ns)}</p>
                        <div className="deadline-container">
                            <img src={Clock} alt="" />
                            <Timer
                                down={true}
                                className="deadline-timer"
                                secondsToDo={5}
                                timerCallback={() => window.location.replace(successUrl)}
                            />
                        </div>
                    </>
                )}
            </div>

            <Footer
                buttonCaption={t("returnBtn", ns)}
                buttonCallback={() => window.location.replace(successUrl)}
                nextPage={successUrl}
                nextEnabled={successUrl}
                noIcon={true}
                showCancelBtn={false}
            />
        </div>
    );
};

export default SuccessPage;
