import { useContext } from "react";
import AppContext from "../AppContext";
import Timer from "../ui/Timer";
import ClockOrange from "../assets/images/clock_orange.svg";

const PayHeader = ({ amount, currency, bankName, countryName, transgran = false, timestamp = undefined }) => {
    const { t } = useContext(AppContext);
    const ns = { ns: "PayHeader" };

    const now = new Date().getTime();
    const timeLeft = (timestamp * 1000 + 15 * 1000 * 60 - now) / 1000;

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
                <Timer down={true} className="deadline-timer" secondsToDo={timeLeft > 0 ? timeLeft : 0} />
            </div>
        </div>
    );
};

export default PayHeader;
