import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import Wallet from "../assets/images/wallet.png";
import WalletPayout from "../assets/images/payOut/wallet.png";

import { useContext } from "react";
import AppContext from "../AppContext";
import { Outlet } from "react-router-dom";
import usePaymentPage from "../hooks/usePaymentPage.jsx";

const MainPage = () => {
    const contextData = useContext(AppContext);
    const payOutMode = contextData?.BFData?.mode === "payOut";

    usePaymentPage({ absolutePath: true });

    //translation
    let { t } = contextData;
    const ns = { ns: payOutMode ? ["PayOut", "Common", "Main"] : ["Common", "Main"] };

    return (
        <div className="container">
            <Header />

            <div className="content">
                {!payOutMode ? (
                    <>
                        <h1>{t("header", ns)}</h1>
                        <div className="wallet-image-container">
                            <img src={Wallet} alt="" />
                        </div>
                        <div className="description grow">
                            <p>{t("description.part1", ns)}</p>
                            <p>{t("description.part2", ns)}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <h1>{t("header", ns)}</h1>
                        <div className="wallet-image-container margins">
                            <img src={WalletPayout} alt="" />
                        </div>
                        <div className="description grow">
                            <p>{t("description.part1", ns)}</p>
                            <p>{t("description.part2", ns)}</p>
                        </div>
                    </>
                )}
            </div>

            <Footer buttonCaption={t("continue", ns)} nextPage={c.PAGE_PAYMENT_METHODS} />

            <Outlet />
        </div>
    );
};

export default MainPage;
