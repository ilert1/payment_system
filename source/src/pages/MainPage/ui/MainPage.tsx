import axios from "axios";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "@/AppContext";
import usePaymentPage from "@/hooks/usePaymentPage";
import WalletPayout from "@/shared/assets/images/payOut/wallet.png";
import Wallet from "@/shared/assets/images/wallet.png";
import { AppRoutes } from "@/shared/const/router";
import { classNames } from "@/shared/lib/classNames";
import { useBFStore } from "@/shared/store/bfDataStore";
import Loader from "@/shared/ui/Loader";
import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets/Header";
import { Page } from "@/widgets/Page";
import styles from "./MainPage.module.scss";

export const MainPage = () => {
    const { fingerprintConfig, ym } = useAppContext();
    const BFData = useBFStore(state => state.BFData);
    const setStatus = useBFStore(state => state.setStatus);

    const payOutMode = Boolean(BFData?.payout);
    const ns = { ns: payOutMode ? ["PayOut", "Common", "Main", "Pay"] : ["Common", "Main", "Pay"] };
    const { t } = useTranslation(payOutMode ? ["PayOut", "Common", "Main", "Pay"] : ["Common", "Main", "Pay"]);

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

    return (
        <Page>
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
                                <div className={styles.walletImageContainer}>
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
                                <div className={classNames(styles.walletImageContainer, {}, [styles.margins])}>
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
        </Page>
    );
};
