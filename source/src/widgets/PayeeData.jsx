/* eslint-disable react/prop-types */
import { useContext } from "react";
import AppContext from "../AppContext";
import CardsIcon from "../assets/images/cards.svg";
import DollarCircleIcon from "../assets/images/dollar-circle.svg";
import User2Icon from "../assets/images/user2.svg";
import PayeeDataItem from "./PayeeDataItem";

import DefaultBankIcon from "../assets/images/bank.svg";

const bankIcon = bank => {
    return bank ? `/banks/${bank}.svg` : DefaultBankIcon;
};

export const formatedRequisite = (req, isPhone, caseName) => {
    if (req) {
        req = req.replace(/\s+/g, "");
        if (isPhone) {
            switch (caseName) {
                case "tjs":
                    return req.replace(/^\+?(\d{3})(\d{2})(\d{3})(\d{4})$/, "+$1 ($2) $3 $4");
                case "azn":
                    return req.replace(/^\+?(\d{3})(\d{2})(\d{3})(\d{4})$/, "+$1 ($2) $3 $4");
                default:
                    return req.replace(/^\+?(\d{1})(\d{3})(\d{3})(\d{4})$/, "+$1 ($2) $3 $4");
            }
        } else {
            return req.replace(/(.{4})/g, "$1 ");
        }
    }
};

const PayeeData = ({ requisite, trader, bankName, isPhone, caseName, transgran, countryName }) => {
    const { BFData, getCurrencySymbol, t } = useContext(AppContext);
    const ns = { ns: ["PayeeCard", "PayHeader", "Pay"] };

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    return (
        <div className="payee-data">
            {bankName && (
                <PayeeDataItem
                    img={bankIcon(trader?.bank_name)}
                    onError={e => {
                        e.target.src = DefaultBankIcon;
                        e.target.classList.remove("logo");
                    }}
                    label={t("bankName", ns)}
                    value={bankName}
                    cl={"dark"}
                    imgCl={"logo"}
                />
            )}
            <PayeeDataItem
                img={CardsIcon}
                label={t("requisite", ns)}
                value={formatedRequisite(requisite, isPhone, caseName)}
                copyData={requisite?.replace(/\s+/g, "")}
                messageOnCopy={isPhone ? t("copyedPhone", ns) : t("copyed", ns)}
                comment={`${t("requisiteComment", ns)} ${
                    transgran
                        ? t("transgranComment", { country: t(`steps_transgran_new.country.${countryName}`, ns), ...ns })
                        : ""
                }`}
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
