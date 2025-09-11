import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/AppContext";
import { useBFStore } from "@/shared/store/bfDataStore";
import { Heading } from "@/shared/ui/Heading/Heading";
import { Loader } from "@/shared/ui/Loader/Loader";
import SearchPayMethod from "@/shared/ui/SearchPayMethod/SearchPayMethod";
import { Text } from "@/shared/ui/Text/Text";
import { BankItem } from "@/widgets/BankItem";
import styles from "./PayInstrument.module.scss";

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
            <div className={styles.payMethod}>
                <Heading className={styles.h2} size="m" title={t("payMethod", ns)} />
                <SearchPayMethod setFilterText={setFilterText} />
            </div>
            <div className={styles.banksListContainer}>
                {instruments?.length ? (
                    <div className={styles.banksList}>{instruments}</div>
                ) : (
                    <div className={styles.banksList}>
                        {isFetching ? <Loader /> : <Text className={styles.p} text={t("emptyList", ns)} />}
                    </div>
                )}
            </div>
        </>
    );
};
