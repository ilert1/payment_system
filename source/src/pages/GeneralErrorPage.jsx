import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext } from "react";
import AppContext from "../AppContext";
import PlusCircle from "../assets/images/plus-circle.svg";

export const GeneralErrorPage = () => {
    const { t } = useContext(AppContext);
    const { setIsActive } = useContext(AppContext).supportDialog;

    //translation
    const ns = { ns: ["Common", "GeneralError"] };

    const buttonCallback = () => {
        setIsActive(true);
    };

    return (
        <div className="container">
            <Header />

            <div className="content">
                <div className="header-container grow">
                    <h1>{t("error", ns)}</h1>
                </div>
                <div className="description low-mb low-mt">
                    <p>{t("repeatOrder", ns)}</p>
                </div>
                <img className="error-image" src={PlusCircle} alt="" />
            </div>

            <Footer buttonCaption={t("repeatOrder", ns)} nextPage={c.PAGE_PAYMENT_INSTRUMENT} noIcon={true} />
        </div>
    );
};

export default GeneralErrorPage;
