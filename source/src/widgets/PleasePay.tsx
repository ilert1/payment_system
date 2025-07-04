import AlertCircle from "../assets/images/alert-circle.svg?react";
import { useTranslation } from "react-i18next";

interface PleasePayProps {
    amount: string;
    currency: string;
    payOut?: boolean;
    bank?: string;
}

export const PleasePay = (props: PleasePayProps) => {
    const { amount, currency, payOut = false, bank = "" } = props;
    const { t } = useTranslation();
    //translation
    const ns = { ns: ["PleasePay", "PayOut", "PayeeSearch"] };

    return (
        <div className="header-container grow">
            {/* <img src={AlertCircle} alt="" /> */}
            <AlertCircle />

            {payOut && (
                <h1>
                    {t("payout", ns)}{" "}
                    <span className="amount">
                        {amount}&nbsp;{currency}
                    </span>
                    {/* {" "}{t("via", ns)} {bank} */}
                </h1>
            )}
            {!payOut && (
                <h1>
                    {t("transfer", ns)} {amount}&nbsp;{currency}
                </h1>
            )}
        </div>
    );
};
