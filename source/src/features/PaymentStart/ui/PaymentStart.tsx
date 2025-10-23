import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useAppContext } from "@/AppContext";
import { ContentDescription } from "@/entities/payment";
import WalletPayout from "@/shared/assets/images/payOut/wallet.png";
import Wallet from "@/shared/assets/images/wallet.png";
import { classNames } from "@/shared/lib/classNames";
import { useFooterStore } from "@/shared/store/FooterStore/slice/FooterSlice";
import { useBFStore } from "@/shared/store/bfDataStore";
import { Heading } from "@/shared/ui/Heading/Heading";
import { Text } from "@/shared/ui/Text/Text";
import { usePaymentStartStore } from "../model/slice/PaymentStartSlice";
import styles from "./PaymentStart.module.scss";

export const PaymentStart = () => {
    const { fingerprintConfig, ym } = useAppContext();
    const BFData = useBFStore(state => state.BFData);
    const { startPayment } = usePaymentStartStore();
    const payOutMode = Boolean(BFData?.payout);

    const { t } = useTranslation(payOutMode ? ["PayOut", "Common", "Main"] : ["Common", "Main"]);
    const ns = { ns: payOutMode ? ["PayOut", "Common", "Main"] : ["Common", "Main"] };

    const setFooter = useFooterStore(state => state.setFooter);
    const dest = payOutMode ? "payout" : "payment";

    const btnCallback = async () => {
        try {
            await startPayment({ fingerprintHeaders: fingerprintConfig.headers });
        } catch (error) {
            if (error instanceof Error) ym("reachGoal", "error-message", { error: error?.message });
        }
    };

    useEffect(() => {
        if (!BFData?.[dest]?.method) return;

        setFooter({
            buttonCaption: t("continue", ns),
            nextPage: "true",
            buttonCallback: btnCallback,
            isUnicalization: false
        });
    }, [BFData?.[dest]?.method]);

    return !payOutMode ? (
        <>
            <Heading align="center" size="l" title={t("header", ns)} />
            <div className={styles.walletImageContainer}>
                <img src={Wallet} alt="" />
            </div>
            <ContentDescription
                grow
                text={
                    <>
                        <Text align="center" text={t("description.part1", ns)} />
                        <Text align="center" text={t("description.part2", ns)} />
                    </>
                }
            />
        </>
    ) : (
        <>
            <Heading align="center" size="l" title={t("header", ns)} />
            <div className={classNames(styles.walletImageContainer, {}, [styles.margins])}>
                <img src={WalletPayout} alt="" />
            </div>
            <ContentDescription
                grow
                text={
                    <>
                        <Text align="center" text={t("description.part1", ns)} />
                        <Text align="center" text={t("description.part2", ns)} />
                    </>
                }
            />
        </>
    );
};
