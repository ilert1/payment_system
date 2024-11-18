import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext, useEffect } from "react";
import AppContext from "../AppContext";
import PlusCircle from "../assets/images/plus-circle.svg";

export const GeneralErrorPage = ({ cancel = false }) => {
    const { t, BFData } = useContext(AppContext);
    // const { setIsActive } = useContext(AppContext).supportDialog;

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const failUrl = BFData?.[dest]?.method?.context?.error_redirect_url;
    const cancelUrl = BFData?.[dest]?.method?.context?.cancel_redirect_url;

    //translation
    const ns = { ns: ["Common", "GeneralError"] };

    // const buttonCallback = () => {
    //     setIsActive(true);
    // };

    useEffect(() => {
        console.log("fail_url: ", BFData);
    }, []);

    return (
        <div className="container">
            <Header />

            <div className="content">
                <div className="header-container grow">
                    <h1>{t(cancel ? "cancelPage.cancel" : "error", ns)}</h1>
                </div>
                <div className="description low-mb low-mt">
                    <p>{t(cancel ? "cancelPage.transactionCanceled" : "repeatOrder", ns)}</p>
                </div>
                <img className="error-image" src={PlusCircle} alt="" />
            </div>

            <Footer
                buttonCaption={t("returnBtn", ns)}
                buttonCallback={() => window.location.replace(cancel ? cancelUrl : failUrl)}
                nextPage={cancel ? cancelUrl : failUrl}
                nextEnabled={cancel ? cancelUrl : failUrl}
                noIcon={true}
                showCancelBtn={false}
            />
        </div>
    );
};

export default GeneralErrorPage;
