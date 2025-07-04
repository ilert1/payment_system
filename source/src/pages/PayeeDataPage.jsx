import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext } from "react";
import AppContext from "../AppContext";
import { Loader } from "../shared/ui/Loader";
import { Timer } from "../shared/ui/Timer";

import usePaymentPage from "../hooks/usePaymentPage.jsx";

const PayeeDataPage = () => {
    const { BFData, t, getCurrencySymbol, ym } = useContext(AppContext);

    //translation
    const ns = { ns: "PayeeData" };
    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    usePaymentPage({ absolutePath: false });

    const redirect = url => {
        document.location.replace(url);
    };

    const buttonCallback = () => {
        ym("reachGoal", "back-return-button", {
            back_redirect_url: BFData?.[dest]?.method?.context?.back_redirect_url
        });
        redirect(BFData?.[dest]?.method?.context?.back_redirect_url);
    };

    return (
        <div className="container">
            <Header />

            <div className="content">
                <div className="header-container grow">
                    <h1>
                        {t("waitConfirmation", ns)} {BFData?.amount}&nbsp;
                        {getCurrencySymbol(BFData?.currency)}
                    </h1>
                </div>
                <div className="description low-mb low-mt">
                    <p>{t("waitComment", ns)}</p>
                </div>
                <div className="loader-container">
                    <Loader />
                    <Timer />
                    <p className="status-comment">{t("waitTime", ns)}</p>
                </div>
            </div>

            <Footer
                buttonCallback={BFData?.[dest]?.method?.context?.back_redirect_url ? buttonCallback : () => {}}
                buttonCaption={BFData?.[dest]?.method?.context?.back_redirect_url ? t("backToSite", ns) : ""}
                nextPage={BFData?.[dest]?.method?.context?.back_redirect_url}
                payeeCard={true}
                showCancelBtn={false}
            />
        </div>
    );
};

export default PayeeDataPage;
