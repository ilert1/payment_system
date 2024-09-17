import * as c from "../assets/constants.js";
import Header from "../widgets/Header.jsx";
import Footer from "../widgets/Footer.jsx";
import PayoutSubmitModal from "../widgets/PayoutSubmitModal";

import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext.jsx";
import { PleasePay } from "../widgets/PleasePay.jsx";
import { DeadlineInfo } from "../widgets/DeadlineInfo.jsx";
import { PayoutBar } from "../widgets/PayoutBar.jsx";
import axios from "axios";

const PayOutPage = () => {
    const {
        setBFData,
        BFData,
        currentPaymentInstrument,
        t,
        getCurrencySymbol,
        supportDialog,
        fingerprintConfig,
        navigate
    } = useContext(AppContext);

    const ns = { ns: ["Common", "PayOut"] };
    const nav = navigate();

    const [showPayoutSubmit, setShowPayoutSubmit] = useState(false);
    const [disabledButon, setDisabledButon] = useState(true);
    const [awaiting, setAwaiting] = useState(true);
    const [loadingButton, setLoadingButton] = useState(false);

    useEffect(() => {
        if (BFData?.status === "payoutLotSearching") {
            setAwaiting(true);
        } else if (BFData?.status === "payoutLotConfirmedByPayee") {
            setDisabledButon(false);
            setAwaiting(false);
        } else {
            setAwaiting(false);
        }
    }, [BFData?.status]);

    useEffect(() => {
        const es = new EventSource(`${import.meta.env.VITE_API_URL}/payouts/${BFData?.id}/events`);

        es.onopen = () => console.log(">>> Connection opened!");

        es.onerror = e => console.log("ERROR!", e);

        es.onmessage = async e => {
            try {
                const resEventData = JSON.parse(e.data);

                if (resEventData.event === "statusChanged") {
                    const { data } = await axios
                        .get(`${import.meta.env.VITE_API_URL}/payouts/${BFData?.id}`, fingerprintConfig)
                        .catch(e => {
                            console.log(e);
                        });

                    if (data) {
                        if (data?.success) {
                            setBFData(data?.data);

                            if (
                                data?.data.status === "payoutFullyExecuted" ||
                                data?.data.status === "payoutPartiallyExecuted"
                            ) {
                                nav(c.PAGE_SUCCESS, { replace: true });
                            }
                        } else {
                            if (data?.data.fail_url) {
                                window.location.replace(data?.data.fail_url);
                            } else {
                                nav(c.PAGE_PAYOUT_NOT_FOUND, { replace: true });
                            }
                        }
                    }
                }
            } catch (error) {
                // continue
            }
        };

        return () => es.close();
    }, [BFData?.id, fingerprintConfig, nav, setBFData]);

    const approveLotHandler = async () => {
        try {
            setLoadingButton(true);

            await axios
                .patch(
                    `${import.meta.env.VITE_API_URL}/payouts/${BFData?.id}`,
                    { status: "payoutLotConfirmedByPayee" },
                    fingerprintConfig
                )
                .catch(e => {
                    console.log(e);
                });
        } catch (e) {
            console.error(e.response.message);
        } finally {
            setLoadingButton(false);
            setShowPayoutSubmit(false);
        }
    };

    return (
        <div className="container">
            <Header />
            <div className="content">
                <PleasePay
                    amount={BFData?.amount}
                    currency={getCurrencySymbol(BFData?.currency)}
                    payOut={true}
                    bank={currentPaymentInstrument?.bank_name}
                />

                <DeadlineInfo bankName={currentPaymentInstrument?.bank_name} />

                <PayoutBar payoutLots={BFData?.lots} sumAmount={Number(BFData?.amount)} awaiting={awaiting} />

                <div className="instructions small">
                    <ul>
                        <h2>{t("dontCloseWindow", ns)}</h2>
                        <li>
                            <span>1. </span>
                            {t("dontCloseSteps.one", ns)}
                        </li>
                        <li>
                            <span>2. </span>
                            {t("dontCloseSteps.two", ns)}
                        </li>
                        <li>
                            <span>3. </span>
                            {t("dontCloseSteps.three", ns)}
                        </li>
                    </ul>
                </div>
            </div>

            {showPayoutSubmit && (
                <PayoutSubmitModal
                    data={{
                        title: `${t("transferInAmount", ns)} ${
                            BFData.lots[BFData.lots.length - 1].amount
                        }\u00A0${getCurrencySymbol(BFData?.currency)} ${t("transferReceived", ns)}?`,
                        text: t("approveTransferText", ns),
                        toggleText: t("approveReceivedCheckbox", ns),
                        primaryBtnText: t("appreveButtonText", ns),
                        primaryBtnCallback: approveLotHandler,
                        secondaryBtnText: t("notYet", ns),
                        loadingButton: loadingButton
                    }}
                    closeModal={() => setShowPayoutSubmit(false)}
                />
            )}

            <Footer
                approveButton={{
                    caption: t("approvePayout", ns),
                    disabled: disabledButon,
                    callback: () => {
                        setShowPayoutSubmit(true);
                    }
                }}
                discardButton={{
                    caption: t("discardPayout", ns),
                    disabled: disabledButon,
                    callback: () => {
                        supportDialog.setIsActive(true);
                    }
                }}
            />
        </div>
    );
};

export default PayOutPage;
