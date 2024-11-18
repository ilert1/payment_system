// import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import PlusCircle from "../assets/images/plus-circle.svg";

const PayErrorPage = (notFound = false) => {
    const { t, BFData, failUrlParams } = useContext(AppContext);
    // const { setIsActive } = useContext(AppContext).supportDialog;

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

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
                // buttonCallback={!notFound && buttonCallback}
                // payeeCard={!notFound && true}
                nextPage={BFData?.[dest]?.method?.context?.error_redirect_url}
                nextEnabled={BFData?.[dest]?.method?.context?.error_redirect_url}
                noIcon={true}
                showCancelBtn={false}
            />
        </div>
    );
};

export default PayErrorPage;
