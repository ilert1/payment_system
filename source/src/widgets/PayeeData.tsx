/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";
import DefaultBankIcon from "@/shared/assets/images/bank.svg";
import { formatedRequisite } from "@/shared/lib/formattedRequisite";
import { useBFStore } from "@/shared/store/bfDataStore";
import { useAppContext } from "../AppContext";
import CardsIcon from "../shared/assets/images/cards.svg?react";
import DollarCircleIcon from "../shared/assets/images/dollar-circle.svg?react";
import User2Icon from "../shared/assets/images/user2.svg?react";
import { PayeeDataItem } from "./PayeeDataItem";

const bankIcon = (bank: string) => {
    return bank ? `/banks/${bank}.svg` : DefaultBankIcon;
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

    const { getCurrencySymbol } = useAppContext();
    const { BFData } = useBFStore();
    const { t } = useTranslation();
    const ns = { ns: ["PayeeCard", "PayHeader", "Pay"] };

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    return (
        <div className="payee-data">
            {bankName && (
                <PayeeDataItem
                    Img={bankIcon(trader?.bank_name ?? "")}
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
            {requisite && (
                <PayeeDataItem
                    Img={CardsIcon}
                    label={t("requisite", ns)}
                    labelCode="requisite"
                    value={formatedRequisite(requisite, isPhone, caseName)}
                    copyData={requisite?.replace(/\s+/g, "")}
                    messageOnCopy={isPhone ? t("copyedPhone", ns) : t("copyed", ns)}
                    comment={`${t("requisiteComment", ns)} ${
                        transgran
                            ? t("transgranComment", {
                                  country: t(`steps_transgran_new.country.${countryName}`, ns),
                                  ...ns
                              })
                            : ""
                    }`}
                />
            )}
            <PayeeDataItem
                Img={DollarCircleIcon}
                label={t("amount", ns)}
                labelCode="amount"
                value={`${BFData?.[dest]?.amount}\u00A0${getCurrencySymbol(BFData?.[dest]?.currency ?? "")}`}
                copyData={BFData?.[dest]?.amount}
                messageOnCopy={t("copyedAmount", ns)}
            />
            {trader?.card_holder && (
                <PayeeDataItem Img={User2Icon} label={t("payee", ns)} value={trader?.card_holder} />
            )}
        </div>
    );
};

export default PayeeData;
