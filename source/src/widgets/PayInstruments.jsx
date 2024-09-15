import { useState, useContext } from "react";
import AppContext from "../AppContext";

import SearchPayMethod from "../ui/SearchPayMethod";
import BankItem from "./BankItem";
import { Loader } from "../ui/Loader";

export const PayInstruments = ({ paymentInstruments, isFetching }) => {
    const { t, currentPaymentInstrument, setCurrentPaymentInstrument } = useContext(AppContext);
    //translation
    const ns = { ns: ["Common", "PayMethod"] };

    const onClick = item => {
        setCurrentPaymentInstrument(item);
    };

    const [filterText, setFilterText] = useState("");

    const getInstruments = paymentInstruments => {
        let instrumentList = [];

        let filteredPaymentInstruments = paymentInstruments;
        if (filterText) {
            filteredPaymentInstruments = paymentInstruments.filter(item => item?.bank_name.includes(filterText));
        }

        filteredPaymentInstruments?.map((item, i) => {
            instrumentList.push(
                <BankItem
                    key={`bank${i}`}
                    active={
                        item.bank == currentPaymentInstrument?.bank &&
                        item.payment_type == currentPaymentInstrument?.payment_type
                            ? true
                            : false
                    }
                    onClick={() => onClick(item)}
                    bankName={`${item.bank_name} ${
                        item.payment_type != "card2card" ? `(${item.payment_type_name})` : ""
                    }`}
                    /* lowLimit = {'500 ₽'} highLimit = {'1 000 000 ₽'} */
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
