/* eslint-disable react/prop-types */
import { Timer } from "../shared/ui/Timer";
import Loading from "../shared/assets/images/payOut/loading.svg?react";
import ApproveOne from "../shared/assets/images/payOut/approveOne.svg?react";
import ApproveFill from "../shared/assets/images/payOut/approveFill.svg?react";
import { useContext } from "react";
import AppContext from "../AppContext";
import { useTranslation } from "react-i18next";

interface PayoutBarProps {
    payoutLots: any[];
    sumAmount: number;
    awaiting: boolean;
}

export const PayoutBar = (props: PayoutBarProps) => {
    const { payoutLots = [], sumAmount = 0, awaiting = false } = props;
    const { getCurrencySymbol } = useContext(AppContext);
    const { t } = useTranslation();

    //translation
    const ns = { ns: ["Common", "PayOut", "PayeeData"] };

    const progressFillStatus = (status: string) => {
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
                                {item.status === "lotWaitingForPayer" && <Loading />}

                                {item.status === "lotWaitingForPayee" && <ApproveOne />}

                                {item.status === "lotExecuted" && <ApproveFill />}
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
