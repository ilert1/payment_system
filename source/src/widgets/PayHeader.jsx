import { useContext } from "react";
import AppContext from "../AppContext";
import Timer from "../ui/Timer";
import ClockOrange from "../assets/images/clock_orange.svg";

const PayHeader = ({ amount, currency, bankName, countryName, transgran = false }) => {
    const { t } = useContext(AppContext);
    const ns = { ns: "PayHeader" };

    return (
        <div className="pay-header grow">
            <h1>
                {t("transfer", ns)}{" "}
                <span>
                    {amount}&nbsp;{currency}
                </span>
                {countryName && transgran && <> {t(`country.${countryName}`, ns)}</>}
                {bankName && (
                    <>
                        {" "}
                        {t("to", ns)} {bankName}
                    </>
                )}
            </h1>
            <div className="deadline-container">
                <img src={ClockOrange} alt="" />
                <Timer down={true} className="deadline-timer" secondsToDo={60 * 20} />
            </div>
        </div>
    );
};

export default PayHeader;
