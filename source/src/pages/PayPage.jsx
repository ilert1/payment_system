import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { PleasePay } from "../widgets/PleasePay";
import { DeadlineInfo } from "../widgets/DeadlineInfo";
import { PayeeCard } from "../widgets/PayeeCard";
import { PayeeInfo } from "../widgets/PayeeInfo";
import AlertTriangle from "../assets/images/alert-triangle.svg";

import axios from "axios";
import usePaymentPage from "../hooks/usePaymentPage.jsx";
import PayHeader from "../widgets/PayHeader.jsx";
import PayeeData from "../widgets/PayeeData.jsx";

const PayPage = () => {
    const { BFData, currentPaymentInstrument, fingerprintConfig, t, getCurrencySymbol } = useContext(AppContext);

    //translation
    const ns = { ns: ["Common", "Pay"] };

    usePaymentPage({ absolutePath: false });

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const baseApiURL = import.meta.env.VITE_API_URL;

    const trader = BFData?.[dest]?.method?.payee?.data;
    const [requisite, setRequisite] = useState(null);

    const buttonCallback = async () => {
        const { data } = await axios
            .post(
                `${baseApiURL}/${dest}s/${BFData?.[dest]?.id}/events`,
                {
                    event: "paymentPayerConfirm"
                },
                fingerprintConfig
            )
            .catch(e => {
                console.log(e);
            });
        console.log(data);
    };

    useEffect(() => {
        if (trader?.card_number) {
            setRequisite(trader.card_number);
        }
        if (trader?.phone) {
            setRequisite(trader.phone);
        }
        if (trader?.account_number) {
            setRequisite(trader.account_number);
        }
        if (trader?.iban) {
            setRequisite(trader.iban);
        }
        console.log(trader);
    }, [trader]);

    return (
        <div className="container">
            <Header />
            <div className="content">
                <PayHeader
                    amount={BFData?.[dest]?.amount}
                    currency={getCurrencySymbol(BFData?.[dest]?.currency)}
                    bankName={trader?.bank_name}
                />

                <PayeeData
                    requisite={requisite}
                    trader={trader}
                    bankName={BFData?.[dest]?.method?.payee?.data?.bank_name}
                    isPhone={!!trader?.phone}
                />

                <div className="instructions_new">
                    <ul>
                        <li>
                            <span>1. </span>
                            {t("steps_new.one", ns)}
                        </li>
                        <li>
                            <span>2. </span>
                            {t("steps_new.two", ns)} <span>{trader?.bank_name}</span> {t("steps_new.onAmount", ns)}{" "}
                            <span>
                                {BFData?.[dest]?.amount}&nbsp;
                                {getCurrencySymbol(BFData?.[dest]?.currency)}
                            </span>
                        </li>
                        <li>
                            <span>3. </span>
                            {t("steps_new.pressButton", ns)}
                            <span>
                                {' "'}
                                {t("steps_new.payed", ns)}
                                {'"'}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            <Footer
                buttonCaption={t("approveTransfer", ns)}
                buttonCallback={buttonCallback}
                nextPage={`../${c.PAGE_PAYEE_DATA}`}
                // prevPage={c.PAGE_PAYMENT_INSTRUMENT}
                approve={true}
            />
        </div>
    );
};

export default PayPage;
