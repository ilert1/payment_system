// import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext } from "react";
import AppContext from "../AppContext";
import PlusCircle from "../assets/images/plus-circle.svg";

const PayErrorPage = (notFound = false) => {
    const { t, BFData, failUrlParams } = useContext(AppContext);
    // const { setIsActive } = useContext(AppContext).supportDialog;

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const failUrl = BFData?.[dest]?.method?.context?.error_redirect_url;

    //translation
    const ns = { ns: "PayError" };

    // const buttonCallback = () => {
    //     setIsActive(true);
    // };

    console.log(failUrlParams);

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
