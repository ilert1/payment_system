import { useTranslation } from "react-i18next";
import { DeadLineTimer } from "@/shared/ui/DeadlineTimer/DeadLineTimer";
import { Text } from "@/shared/ui/Text/Heading";
import styles from "./PayHeader.module.scss";

interface PayHeaderProps {
    amount: string;
    currency: string;
    bankName: string;
    countryName: string;
    transgran: boolean;
    timestamp: number;
}

export const PayHeader = (props: PayHeaderProps) => {
    const { amount, currency, bankName, countryName, transgran = false, timestamp = 0 } = props;

    const ns = { ns: "PayHeader" };
    const { t } = useTranslation();

    const now = new Date().getTime();
    const timeLeft = (timestamp * 1000 + 15 * 1000 * 60 - now) / 1000;

    return (
        <div className={styles.payHeader}>
            <Text
                size="l"
                title={
                    <>
                        {t("transfer", ns)}{" "}
                        <span className={styles.span}>
                            {amount}&nbsp;{currency}&nbsp;
                        </span>
                        {countryName && transgran && <> {t(`country.${countryName}`, ns)}</>}
                        {bankName && (
                            <>
                                {" "}
                                {t("to", ns)} {bankName}
                            </>
                        )}
                    </>
                }
            />
            <DeadLineTimer timerSecondsTo={timeLeft > 0 ? timeLeft : 0} timerCallback={() => {}} />
        </div>
    );
};
