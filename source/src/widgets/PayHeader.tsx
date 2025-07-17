import Timer from "../shared/ui/Timer";
import ClockOrange from "../shared/assets/images/clock_orange.svg?react";
import { useTranslation } from "react-i18next";

interface PayHeaderProps {
    amount: string;
    currency: string;
    bankName: string;
    countryName: string;
    transgran: boolean;
    timestamp: number;
}

const PayHeader = (props: PayHeaderProps) => {
    const { amount, currency, bankName, countryName, transgran = false, timestamp = 0 } = props;

    const ns = { ns: "PayHeader" };
    const { t } = useTranslation();

    const now = new Date().getTime();
    const timeLeft = (timestamp * 1000 + 15 * 1000 * 60 - now) / 1000;

    return (
        <div className="pay-header grow">
            <h1>
                {t("transfer", ns)}{" "}
                <span>
                    {amount}&nbsp;{currency}&nbsp;
                </span>
                {countryName && transgran && <> {t(`country.${countryName}`, ns)}</>}
                {bankName && (
                    <>
                        {t("to", ns)} {bankName}
                    </>
                )}
            </h1>
            <div className="deadline-container">
                {/* <img src={ClockOrange} alt="" /> */}
                <ClockOrange />
                <Timer down={true} className="deadline-timer" secondsToDo={timeLeft > 0 ? timeLeft : 0} />
            </div>
        </div>
    );
};

export default PayHeader;
