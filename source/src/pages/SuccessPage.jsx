// import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";
// import SupportDialog from "../widgets/SupportDialog";
// import Rating from "../widgets/Rating";

// import { useLocation } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../AppContext";
import usePaymentPage from "../hooks/usePaymentPage";

const SuccessPage = () => {
    const { BFData, resetStorage, t, getCurrencySymbol, payoutMode } = useContext(AppContext);

    //translation
    const ns = { ns: "Success" };

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    usePaymentPage({ absolutePath: false });
    resetStorage();

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

            {BFData?.[dest]?.success_url && <Footer prevPage={BFData?.[dest]?.success_url} absolutePrev={true} />}
        </div>
    );
};

export default SuccessPage;
