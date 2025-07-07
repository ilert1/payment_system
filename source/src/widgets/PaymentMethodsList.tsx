import { useAppContext } from "../AppContext";

import { Loader } from "../shared/ui/Loader";
import MethodButton from "./MethodButton";
import { useTranslation } from "react-i18next";

interface PaymentMethodsListProps {
    paymentMethods: PaymentMethod[];
    isFetching: boolean;
}

export const PaymentMethodsList = ({ paymentMethods, isFetching }: PaymentMethodsListProps) => {
    const { currentPaymentMethod, setCurrentPaymentMethod } = useAppContext();
    const { t } = useTranslation();

    //translation
    const ns = { ns: ["Common", "PayMethod"] };

    const onClick = (item: PaymentMethod) => {
        console.log(item);
        setCurrentPaymentMethod(item);
    };

    const getMethods = (paymentMethods: PaymentMethod[]) => {
        let output: JSX.Element[] = [];

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
