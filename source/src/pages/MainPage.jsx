import * as c from "../shared/assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import Wallet from "../shared/assets/images/wallet.png";
import WalletPayout from "../shared/assets/images/payOut/wallet.png";

import { useContext, useEffect } from "react";
import AppContext from "../AppContext";
import { Outlet } from "react-router-dom";
import usePaymentPage from "../hooks/usePaymentPage.jsx";
import axios from "axios";
import Loader from "../shared/ui/Loader.jsx";

const MainPage = () => {
    const { BFData, fingerprintConfig, t, ym } = useContext(AppContext);
    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const baseApiURL = import.meta.env.VITE_API_URL;

    ym("reachGoal", "main-page", { blowfish_id: BFData?.[dest]?.id });

    const buttonCallback = async () => {
        const { data } = await axios
            .post(
                `${baseApiURL}/${dest}s/${BFData?.[dest]?.id}/events`,
                {
                    event: "paymentPayerStart"
                },
                fingerprintConfig
            )
            .catch(e => {
                console.log(e);
            });
        console.log(data);
    };

    usePaymentPage({ absolutePath: true });

    //translation
    const ns = { ns: payOutMode ? ["PayOut", "Common", "Main"] : ["Common", "Main"] };

    return (
        <div className="container">
            <Header />

            {!BFData?.[dest]?.method ? (
                <div className="content">
                    <div className="loader-container">
                        <Loader />
                    </div>
                </div>
            ) : (
                <>
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

                    <Footer
                        buttonCaption={t("continue", ns)}
                        nextPage={c.PAGE_PAYMENT_METHODS}
                        buttonCallback={buttonCallback}
                    />
                </>
            )}

            <Outlet />
        </div>
    );
};

export default MainPage;
