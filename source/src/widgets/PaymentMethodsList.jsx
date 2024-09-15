import { useEffect, useState, useContext } from "react";
import AppContext from "../AppContext";

import { Loader } from "../ui/Loader";
import MethodButton from "./MethodButton";

export const PaymentMethodsList = ({ paymentMethods, isFetching }) => {
    const { t, currentPaymentMethod, setCurrentPaymentMethod } = useContext(AppContext);
    //translation
    const ns = { ns: ["Common", "PayMethod"] };

    const onClick = item => {
        console.log(item);
        setCurrentPaymentMethod(item);
    };

    const getMethods = paymentMethods => {
        let output = [];

        paymentMethods?.map((item, i) => {
            output.push(
                <MethodButton
                    key={`method${i}`}
                    onClick={() => onClick(item)}
                    methodName={item.method_name}
                    methodLogo={item.method_logo}
                    active={item.method_id == currentPaymentMethod?.method_id ? true : false}
                />
            );
        });
        return output;
    };

    let methods = getMethods(paymentMethods);

    return (
        <>
            <div className="pay-method">
                <h2>{t("payMethodChoise", ns)}</h2>
            </div>
            <div className="banks-list-container methods-list-container">
                {methods?.length ? (
                    <div className="banks-list">{methods}</div>
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
