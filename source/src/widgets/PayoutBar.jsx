import { Timer } from "../ui/Timer";
import Loading from "../assets/images/payOut/loading.svg";
import ApproveOne from "../assets/images/payOut/approveOne.svg";
import ApproveFill from "../assets/images/payOut/approveFill.svg";

export const PayoutBar = ({ transactions = [], sumAmount = 0, awaiting = false }) => {
    const progressFillStatus = status => {
        switch (status) {
            case "new":
                return "payout-progress__fill--new";
            case "approveOne":
                return "payout-progress__fill--approve-one";
            case "approveFull":
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
                <div className="payout-progress__bar">
                    {transactions.length > 0 &&
                        transactions.map((item, index) => (
                            <div
                                key={index}
                                style={{
                                    width: (Number(item.value) * 100) / Number(sumAmount) + "%",
                                    display: awaiting && item.status !== "approveFull" ? "none" : "flex"
                                }}
                                className={["payout-progress__fill", progressFillStatus(item.status)].join(" ")}>
                                {item.status === "new" && (
                                    <img className="payout-progress__fill-loading" src={Loading} />
                                )}

                                {item.status === "approveOne" && <img src={ApproveOne} />}

                                {item.status === "approveFull" && <img src={ApproveFill} />}

                                {/* <span
                                className={
                                    "payout-progress__roman-number " +
                                    (item.status === "approveOne" || item.status === "new"
                                        ? "payout-progress__roman-number--active"
                                        : "payout-progress__roman-number--disabled")
                                }>
                                {romanNumber(index)}
                            </span>

                            {item.value && item.currency && (
                                <span
                                    className={
                                        "payout-progress__value " +
                                        (item.status === "approveOne" || item.status === "new"
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
                {transactions[transactions.length - 1].status === "await" && (
                    <div className="payout-description__block">
                        <Timer down={false} className="payout-description__timer" />
                        <p className="payout-description__title">Производим поиск оператора</p>
                    </div>
                )}

                {transactions[transactions.length - 1].status === "new" && (
                    <p className="payout-description__title">
                        Ожидайте подтверждение перевода{" "}
                        <span className="payout-description__title--accent">
                            {transactions[transactions.length - 1].value}{" "}
                            {transactions[transactions.length - 1].currency}
                        </span>
                    </p>
                )}

                {transactions[transactions.length - 1].status === "approveOne" && (
                    <p className="payout-description__title">
                        Оператор подтвердил перевод{" "}
                        <span className="payout-description__title--accent">
                            {transactions[transactions.length - 1].value}{" "}
                            {transactions[transactions.length - 1].currency}
                        </span>
                    </p>
                )}

                <p className="payout-description__text">
                    {transactions[transactions.length - 1].status === "await" ||
                    transactions[transactions.length - 1].status === "new"
                        ? "Обычно занимает до 2 минут"
                        : ""}
                    &nbsp; {/* Нужно, чтобы текст не дергался */}
                </p>
            </div>
        </div>
    );
};

export default PayoutBar;
