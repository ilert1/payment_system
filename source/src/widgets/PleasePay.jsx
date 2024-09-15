import { useContext } from "react";
import AppContext from "../AppContext";

import AlertCircle from "../assets/images/alert-circle.svg";

export const PleasePay = ({ amount, currency, payOut = false, bank = "" }) => {
    const { t } = useContext(AppContext);
    //translation
    const ns = { ns: ["PleasePay", "PayOut", "PayeeSearch"] };

    return (
        <div className="header-container grow">
            <img src={AlertCircle} alt="" />

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
