import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext } from "react";
import AppContext from "../AppContext";
import { PleasePay } from "../widgets/PleasePay";
import { DeadlineInfo } from "../widgets/DeadlineInfo";
import { PayeeCard } from "../widgets/PayeeCard";
import { PayeeInfo } from "../widgets/PayeeInfo";
import AlertTriangle from "../assets/images/alert-triangle.svg";

import axios from "axios";
import usePaymentPage from "../hooks/usePaymentPage.jsx";

const PayPage = () => {
    const { BFData, currentPaymentInstrument, fingerprintConfig, t, getCurrencySymbol } = useContext(AppContext);

    //translation
    const ns = { ns: ["Common", "Pay"] };

    usePaymentPage({ absolutePath: false });

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const baseApiURL = import.meta.env.VITE_API_URL;

    const trader = BFData?.[dest]?.method?.payee?.data;

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

    return (
        <div className="container">
            <Header />
            <div className="content">
                <PleasePay amount={BFData?.[dest]?.amount} currency={getCurrencySymbol(BFData?.[dest]?.currency)} />

                <DeadlineInfo bankName={currentPaymentInstrument?.bank_name} />

                <PayeeCard
                    payeeCardNumber={trader?.card_number ? trader?.card_number : trader?.phone}
                    isPhone={!!trader?.phone}
                />

                <PayeeInfo
                    PayeeName={trader?.card_holder ? trader?.card_holder : trader?.bank_name}
                    showPayeeData={trader?.card_number}
                />

                <div className="payment-comment-alert">
                    <img src={AlertTriangle} alt="" />
                    <p>{t("withoutComments", ns)}</p>
                </div>

                <div className="instructions">
                    <ul>
                        <li>
                            <span>1. </span>
                            {t("steps_new.one", ns)} &quot;{currentPaymentInstrument?.bank_name}&quot;
                        </li>
                        <li>
                            <span>2. </span>
                            {t("steps.transfer", ns)} {BFData?.[dest]?.amount}&nbsp;
                            {getCurrencySymbol(BFData?.[dest]?.currency)} {t("steps.wholeAmount", ns)}
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
                buttonCallback={buttonCallback}
                nextPage={`../${c.PAGE_PAYEE_DATA}`}
                // prevPage={c.PAGE_PAYMENT_INSTRUMENT}
                approve={true}
            />
        </div>
    );
};

export default PayPage;
