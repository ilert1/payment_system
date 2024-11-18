/* eslint-disable react/prop-types */
import { useContext } from "react";
import AppContext from "../AppContext";
import BankIcon from "../assets/images/bank.svg";
import CardsIcon from "../assets/images/cards.svg";
import DollarCircleIcon from "../assets/images/dollar-circle.svg";
import User2Icon from "../assets/images/user2.svg";
import PayeeDataItem from "./PayeeDataItem";

const PayeeData = ({ requisite, trader, bankName, isPhone }) => {
    const { BFData, getCurrencySymbol, t } = useContext(AppContext);
    const ns = { ns: "PayeeCard" };

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    return (
        <div className="payee-data">
            {bankName && <PayeeDataItem img={BankIcon} label={t("bankName", ns)} value={bankName} cl={"dark"} />}
            <PayeeDataItem
                img={CardsIcon}
                label={t("requisite", ns)}
                value={requisite}
                copyData={requisite}
                messageOnCopy={isPhone ? t("copyedPhone", ns) : t("copyed", ns)}
            />
            <PayeeDataItem
                img={DollarCircleIcon}
                label={t("amount", ns)}
                value={`${BFData?.[dest]?.amount}\u00A0${getCurrencySymbol(BFData?.[dest]?.currency)}`}
                copyData={BFData?.[dest]?.amount}
                messageOnCopy={t("copyedAmount", ns)}
            />
            {trader?.card_holder && (
                <PayeeDataItem img={User2Icon} label={t("payee", ns)} value={trader?.card_holder} />
            )}
        </div>
    );
};

export default PayeeData;
