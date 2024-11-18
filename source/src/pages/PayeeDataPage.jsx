import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext } from "react";
import AppContext from "../AppContext";
import { Loader } from "../ui/Loader";
import { Timer } from "../ui/Timer";

import usePaymentPage from "../hooks/usePaymentPage.jsx";

const PayeeDataPage = () => {
    const { BFData, t, getCurrencySymbol } = useContext(AppContext);

    //translation
    const ns = { ns: "PayeeData" };

    usePaymentPage({ absolutePath: false });

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

            <Footer payeeCard={true} />
        </div>
    );
};

export default PayeeDataPage;
