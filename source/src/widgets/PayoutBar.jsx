/* eslint-disable react/prop-types */
import { Timer } from "../ui/Timer";
import Loading from "../assets/images/payOut/loading.svg";
import ApproveOne from "../assets/images/payOut/approveOne.svg";
import ApproveFill from "../assets/images/payOut/approveFill.svg";
import { useContext } from "react";
import AppContext from "../AppContext";

export const PayoutBar = ({ payoutLots = [], sumAmount = 0, awaiting = false }) => {
    const { t, getCurrencySymbol } = useContext(AppContext);

    //translation
    const ns = { ns: ["Common", "PayOut", "PayeeData"] };

    const progressFillStatus = status => {
        switch (status) {
            case "lotWaitingForPayer":
                return "payout-progress__fill--new";
            case "lotWaitingForPayee":
                return "payout-progress__fill--approve-one";
            case "lotExecuted":
                return "payout-progress__fill--approve-full";
            default:
                return "";
        }
    };

    return (
        <div className="payout-info">
            <div className="payout-progress">
                <div
                    className={
                        "payout-progress__bar " +
                        (payoutLots.reduce((accum, curVal) => accum + Number(curVal.amount), 0) >= sumAmount
                            ? "payout-progress__bar--complete"
                            : "")
                    }>
                    {payoutLots.length > 0 &&
                        payoutLots.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    width:
                                        Number(item.amount) < Number(sumAmount)
                                            ? (Number(item.amount) * 100) / Number(sumAmount) + "%"
                                            : "100%",
                                    display: awaiting && item.status !== "lotExecuted" ? "none" : "flex"
                                }}
                                className={["payout-progress__fill", progressFillStatus(item.status)].join(" ")}>
                                {item.status === "lotWaitingForPayer" && (
                                    <img className="payout-progress__fill-loading" src={Loading} />
                                )}

                                {item.status === "lotWaitingForPayee" && <img src={ApproveOne} />}

                                {item.status === "lotExecuted" && <img src={ApproveFill} />}
                            </div>
                        ))}

                    {awaiting && <div className="payout-progress__fill--awaiting"></div>}
                </div>
            </div>

            <div className="payout-description">
                {awaiting && (
                    <div className="payout-description__block">
                        <Timer down={false} className="payout-description__timer" />
                        <p className="payout-description__title">{t("lookingForOperator", ns)}</p>
                    </div>
                )}

                {payoutLots.length > 0 && payoutLots[payoutLots.length - 1].status === "lotWaitingForPayer" && (
                    <p className="payout-description__title">
                        {t("waitForTransferConfirmation", ns)}{" "}
                        <span className="payout-description__title--accent">
                            {payoutLots[payoutLots.length - 1].amount}{" "}
                            {getCurrencySymbol(payoutLots[payoutLots.length - 1].currency)}
                        </span>
                    </p>
                )}

                {payoutLots.length > 0 && payoutLots[payoutLots.length - 1].status === "lotWaitingForPayee" && (
                    <p className="payout-description__title">
                        {t("transferConfirmed", ns)}{" "}
                        <span className="payout-description__title--accent">
                            {payoutLots[payoutLots.length - 1].amount}{" "}
                            {getCurrencySymbol(payoutLots[payoutLots.length - 1].currency)}
                        </span>
                    </p>
                )}

                <p className="payout-description__text">
                    {(payoutLots.length > 0 && payoutLots[payoutLots.length - 1].status === "lotWaitingForPayer") ||
                    awaiting
                        ? t("waitTime", ns)
                        : ""}
                    &nbsp; {/* Нужно, чтобы текст не дергался */}
                </p>
            </div>
        </div>
    );
};

export default PayoutBar;
