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

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const PayPage = () => {
    const { navigate, BFData, currentPaymentInstrument, traderData, t, getCurrencySymbol, paymentEcomPage } =
        useContext(AppContext);

    //translation
    const ns = { ns: ["Common", "Pay"] };

    // const currPayMethod = JSON.parse(currentPaymentInstrument);
    const trader = JSON.parse(traderData);

    const nav = navigate();

    useEffect(() => {
        const paymentPage = paymentEcomPage();

        if (paymentPage && !window.location.pathname.includes(paymentPage)) {
            nav("../" + paymentPage, { replace: true });
        }
    }, [nav, paymentEcomPage]);

    return (
        <div className="container">
            <Header />
            <div className="content">
                <PleasePay amount={BFData?.amount} currency={getCurrencySymbol(BFData?.currency)} />

                <DeadlineInfo bankName={currentPaymentInstrument?.bank_name} />

                <PayeeCard payeeCardNumber={trader?.card ? trader?.card : trader?.phone} isPhone={!!trader?.phone} />

                <PayeeInfo
                    PayeeName={trader?.cardholder ? trader?.cardholder : currentPaymentInstrument?.bank_name}
                    showPayeeData={trader?.card}
                />

                <div className="payment-comment-alert">
                    <img src={AlertTriangle} alt="" />
                    <p>{t("withoutComments", ns)}</p>
                </div>

                <div className="instructions">
                    <ul>
                        <li>
                            <span>1. </span>
                            {t("steps.open", ns)} "{currentPaymentInstrument?.bank_name}"
                        </li>
                        <li>
                            <span>2. </span>
                            {t("steps.transfer", ns)} {BFData?.amount}&nbsp;
                            {getCurrencySymbol(BFData?.currency)} {t("steps.wholeAmount", ns)}
                        </li>
                        <li>
                            <span>3. </span>
                            {t("steps.approveTransfer", ns)}
                        </li>
                    </ul>
                </div>
            </div>

            <Footer
                buttonCaption={t("approveTransfer", ns)}
                // buttonCallback={buttonCallback}
                nextPage={`../${c.PAGE_PAYEE_DATA}`}
                // prevPage={c.PAGE_PAYMENT_INSTRUMENT}
                approve={true}
            />
        </div>
    );
};

export default PayPage;
