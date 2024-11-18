// import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";
// import SupportDialog from "../widgets/SupportDialog";
// import Rating from "../widgets/Rating";

// import { useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import AppContext from "../AppContext";
import usePaymentPage from "../hooks/usePaymentPage";

const SuccessPage = () => {
    const { BFData, t, getCurrencySymbol, payoutMode } = useContext(AppContext);

    //translation
    const ns = { ns: "Success" };

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    useEffect(() => {
        console.log("success_url: ", BFData);
    }, []);

    usePaymentPage({ absolutePath: false });
    // resetStorage();

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
                                    <li>
                                        Не выплаченная часть будет возвращена на ваш счет, либо повторите попытку позже.
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <p className="amount">
                            + {BFData?.[dest]?.amount} {getCurrencySymbol(BFData?.[dest]?.currency)}
                        </p>
                    )}
                </div>
            </div>

            {BFData?.[dest]?.method?.context?.success_redirect_url && (
                <Footer
                    buttonCaption={t("returnBtn", ns)}
                    nextPage={BFData?.[dest]?.method?.context?.success_redirect_url}
                    nextEnabled={true}
                    noIcon={true}
                    showCancelBtn={false}
                />
            )}
        </div>
    );
};

export default SuccessPage;
