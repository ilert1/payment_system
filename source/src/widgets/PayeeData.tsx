/* eslint-disable react/prop-types */
import { useAppContext } from "../AppContext";
import CardsIcon from "../shared/assets/images/cards.svg?react";
import DollarCircleIcon from "../shared/assets/images/dollar-circle.svg?react";
import User2Icon from "../shared/assets/images/user2.svg?react";
import PayeeDataItem from "./PayeeDataItem";

import DefaultBankIcon from "../shared/assets/images/bank.svg?react";
import { useTranslation } from "react-i18next";

const bankIcon = (bank: string) => {
    return bank ? `/banks/${bank}.svg` : DefaultBankIcon;
};

export const formatedRequisite = (req: string, isPhone: boolean, caseName: string) => {
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

interface PayeeDataProps {
    requisite: string;
    trader?: Partial<Trader>;
    bankName: string;
    isPhone: boolean;
    caseName: string;
    transgran: boolean;
    countryName: string;
}

const PayeeData = (props: PayeeDataProps) => {
    const { requisite, trader, bankName, isPhone, caseName, transgran, countryName } = props;

    const { BFData, getCurrencySymbol } = useAppContext();
    const { t } = useTranslation();
    const ns = { ns: ["PayeeCard", "PayHeader", "Pay"] };

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    return (
        <div className="payee-data">
            {bankName && (
                <PayeeDataItem
                    img={bankIcon(trader?.bank_name ?? "")}
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
