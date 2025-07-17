import { useState } from "react";
import { useAppContext } from "../AppContext";

import SearchPayMethod from "../shared/ui/SearchPayMethod";
import BankItem from "./BankItem";
import { Loader } from "../shared/ui/Loader";
import { useTranslation } from "react-i18next";
import { useBFStore } from "@/shared/store/bfDataStore";

const bankIcon = (bank: string) => {
    return bank ? `/banks/${bank}.svg` : "";
};

interface PayInstrumentsProps {
    paymentInstruments: PaymentInstrument[];
    isFetching: boolean;
}

export const PayInstruments = ({ paymentInstruments, isFetching }: PayInstrumentsProps) => {
    const { currentPaymentInstrument, setCurrentPaymentInstrument } = useAppContext();
    const { BFData } = useBFStore();
    const { t } = useTranslation();

    //translation
    const ns = { ns: ["Common", "PayMethod"] };

    const onClick = (item: PaymentInstrument) => {
        const dest = BFData?.payout ? "payout" : "payment";
        setCurrentPaymentInstrument({ blowfishId: BFData?.[dest]?.id, data: item });
    };

    const [filterText, setFilterText] = useState("");

    const getInstruments = (paymentInstruments: PaymentInstrument[]) => {
        let instrumentList: JSX.Element[] = [];

        let filteredPaymentInstruments = paymentInstruments;
        if (filterText) {
            filteredPaymentInstruments = paymentInstruments.filter(item =>
                item?.bank_name.toLowerCase().includes(filterText.toLowerCase())
            );
        }

        filteredPaymentInstruments?.map((item, i) => {
            instrumentList.push(
                <BankItem
                    key={`bank${i}`}
                    active={
                        item.bank == currentPaymentInstrument?.data?.bank &&
                        item.payment_type == currentPaymentInstrument?.data?.payment_type
                            ? true
                            : false
                    }
                    onClick={() => onClick(item)}
                    bankIcon={bankIcon(item.bank)}
                    bankName={`${item.bank_name} ${
                        item.payment_type != "card2card" ? `(${item.payment_type_name})` : ""
                    }`}
                />
            );
        });
        return instrumentList;
    };

    let instruments = getInstruments(paymentInstruments);

    return (
        <>
            <div className="pay-method">
                <h2>{t("payMethod", ns)}</h2>
                <SearchPayMethod setFilterText={setFilterText} />
            </div>
            <div className="banks-list-container">
                {instruments?.length ? (
                    <div className="banks-list">{instruments}</div>
                ) : (
                    <div className="banks-list">
                        {isFetching ? (
                            <div className="loader-container">
                                <Loader />
                            </div>
                        ) : (
                            <p className="empty center">{t("emptyList", ns)}</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};
