// import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext, useState } from "react";
import AppContext from "../AppContext";
import PlusCircle from "../assets/images/plus-circle.svg";

const PayErrorPage = (notFound = false) => {
    const { t, BFData, failUrlParams } = useContext(AppContext);
    const { setIsActive } = useContext(AppContext).supportDialog;

    //translation
    const ns = { ns: "PayError" };

    const buttonCallback = () => {
        setIsActive(true);
    };

    // console.log(BFData?.fail_url);
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
                buttonCaption={t("payed", ns)}
                buttonCallback={!notFound && buttonCallback}
                payeeCard={!notFound && true}
                // nextPage={`/${BFData?.blowfish_id}/${c.PAGE_PAYMENT_CONFIRMATION}`}
                noIcon={true}
                // prevPage={BFData?.fail_url ? BFData?.fail_url : ""}
                prevPage={BFData?.fail_url ? `${BFData?.fail_url}${failUrlParams}` : ""}
                absolutePrev={true}
            />
        </div>
    );
};

export default PayErrorPage;
