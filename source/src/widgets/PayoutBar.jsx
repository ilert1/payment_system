import { Timer } from "../ui/Timer";
import Loading from "../assets/images/payOut/loading.svg";
import ApproveOne from "../assets/images/payOut/approveOne.svg";
import ApproveFill from "../assets/images/payOut/approveFill.svg";
import { useContext } from "react";
import AppContext from "../AppContext";

export const PayoutBar = ({ payoutLots = [], sumAmount = 0, awaiting = false }) => {
    const { t } = useContext(AppContext);

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

    // const romanNumber = index => {
    //     switch (index) {
    //         case 0:
    //             return "I";
    //         case 1:
    //             return "II";
    //         case 2:
    //             return "III";
    //         case 3:
    //             return "IV";
    //         case 4:
    //             return "V";
    //         case 5:
    //             return "VI";
    //         default:
    //             return "";
    //     }
    // };

    return (
        <div className="payout-info">
            <div className="payout-progress">
                <div
                    className={
                        "payout-progress__bar " +
                        (payoutLots.reduce((accum, curVal) => accum + Number(curVal.value), 0) >= sumAmount
                            ? "payout-progress__bar--complete"
                            : "")
                    }>
                    {payoutLots.length > 0 &&
                        payoutLots.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    width: (Number(item.value) * 100) / Number(sumAmount) + "%",
                                    display: awaiting && item.status !== "lotExecuted" ? "none" : "flex"
                                }}
                                className={["payout-progress__fill", progressFillStatus(item.status)].join(" ")}>
                                {item.status === "lotWaitingForPayer" && (
                                    <img className="payout-progress__fill-loading" src={Loading} />
                                )}

                                {item.status === "lotWaitingForPayee" && <img src={ApproveOne} />}

                                {item.status === "lotExecuted" && <img src={ApproveFill} />}

                                {/* <span
											className={
													"payout-progress__roman-number " +
													(item.status === "lotWaitingForPayee" || item.status === "lotWaitingForPayer"
															? "payout-progress__roman-number--active"
															: "payout-progress__roman-number--disabled")
											}>
											{romanNumber(index)}
									</span>

									{item.value && item.currency && (
											<span
													className={
															"payout-progress__value " +
															(item.status === "lotWaitingForPayee" || item.status === "lotWaitingForPayer"
																	? "payout-progress__value--active"
																	: "payout-progress__value--disabled")
													}>
													{item.value} {item.currency}
											</span>
									)} */}
                            </div>
                        ))}

                    {awaiting && <div className="payout-progress__fill--awaiting"></div>}
                </div>
            </div>

            <div className="payout-description">
                {awaiting && (
                    <div className="payout-description__block">
                        <Timer down={false} className="payout-description__timer" />
                        <p className="payout-description__title">{t("waitForTransferConfirmation", ns)}</p>
                    </div>
                )}

                {payoutLots.length > 0 && payoutLots[payoutLots.length - 1].status === "lotWaitingForPayer" && (
                    <p className="payout-description__title">
                        {t("waitForTransferConfirmation", ns)}{" "}
                        <span className="payout-description__title--accent">
                            {payoutLots[payoutLots.length - 1].value} {payoutLots[payoutLots.length - 1].currency}
                        </span>
                    </p>
                )}

                {payoutLots.length > 0 && payoutLots[payoutLots.length - 1].status === "lotWaitingForPayee" && (
                    <p className="payout-description__title">
                        {t("transferConfirmed", ns)}{" "}
                        <span className="payout-description__title--accent">
                            {payoutLots[payoutLots.length - 1].value} {payoutLots[payoutLots.length - 1].currency}
                        </span>
                    </p>
                )}

                <p className="payout-description__text">
                    {payoutLots.length > 0 &&
                    (payoutLots[payoutLots.length - 1].status === "await" ||
                        payoutLots[payoutLots.length - 1].status === "lotWaitingForPayer")
                        ? t("waitTime", ns)
                        : ""}
                    &nbsp; {/* Нужно, чтобы текст не дергался */}
                </p>
            </div>
        </div>
    );
};

export default PayoutBar;
