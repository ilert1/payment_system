import Header from "../widgets/Header.js";
import Footer from "../widgets/Footer.js";

import Wallet from "../shared/assets/images/wallet.png";
import WalletPayout from "../shared/assets/images/payOut/wallet.png";

import { useAppContext } from "../AppContext.js";
import { Outlet } from "react-router-dom";
import usePaymentPage from "../hooks/usePaymentPage";
import axios from "axios";
import Loader from "@/shared/ui/Loader";
import { useBFStore } from "@/shared/store/bfDataStore.js";
// import { AppRoutes } from "@/shared/const/router.js";
import { toast } from "react-toastify";

const MainPage = () => {
    const { fingerprintConfig, t, ym } = useAppContext();
    const BFData = useBFStore(state => state.BFData);
    const setStatus = useBFStore(state => state.setStatus);

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const baseApiURL = import.meta.env.VITE_API_URL;

    ym("reachGoal", "main-page", { blowfish_id: BFData?.[dest]?.id });

    const buttonCallback = async () => {
        const data = await axios
            .post(
                `${baseApiURL}/${dest}s/${BFData?.[dest]?.id}/events`,
                {
                    event: "paymentPayerStart"
                },
                fingerprintConfig
            )
            .then(res => {
                const data = res.data;
                if (!data.success) {
                    if (data?.error == "8001") {
                        if (data?.state) setStatus(data.state);
                    } else {
                        throw new Error(data?.error_details ? data.error_details : data?.error);
                    }
                }
            })
            .catch(e => {
                ym("reachGoal", "error-message", { error: e?.message });

                toast.error(t("check_load_errors.generalError", ns), {
                    closeButton: <></>,
                    autoClose: 2000
                });
                return e;
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

                    <Footer buttonCaption={t("continue", ns)} nextPage={"true"} buttonCallback={buttonCallback} />
                </>
            )}

            <Outlet />
        </div>
    );
};

export default MainPage;
