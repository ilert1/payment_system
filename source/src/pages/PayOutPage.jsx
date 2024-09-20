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
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import SupportChatModal from "../widgets/SupportChatModal.jsx";

const PayOutPage = () => {
    const {
        setBFData,
        BFData,
        currentPaymentInstrument,
        t,
        getCurrencySymbol,
        fingerprintConfig,
        navigate,
        supportDialog
    } = useContext(AppContext);

    const ns = { ns: ["Common", "PayOut"] };
    const nav = navigate();

    const [showPayoutSubmit, setShowPayoutSubmit] = useState(false);
    const [disabledButon, setDisabledButon] = useState(true);
    const [awaiting, setAwaiting] = useState(true);
    const [isDispute, setIsDispute] = useState(false);
    const [submitProcess, setSubmitProcess] = useState(false);

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
                            toast(
                                <>
                                    <p>Ошибка ответа сервера.</p>
                                    <p>Повторите попытку позже.</p>
                                </>
                            );
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

    const { isSuccess, isError, isFetched } = useQuery({
        queryKey: ["submitLotByPayee"],
        enabled: submitProcess,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        queryFn: async () => {
            const { data } = await axios.patch(
                `${import.meta.env.VITE_API_URL}/payouts/${BFData?.id}`,
                { status: "payoutLotConfirmedByPayee" },
                fingerprintConfig
            );

            return data;
        }
    });

    useEffect(() => {
        if (isSuccess) {
            setSubmitProcess(false);
            setDisabledButon(true);
            setShowPayoutSubmit(false);
        } else if (isError) {
            toast(
                <>
                    <p>Ошибка ответа сервера.</p>
                    <p>Повторите попытку позже.</p>
                </>
            );
        } else if (!isFetched) {
            setSubmitProcess(false);
        }
    }, [isFetched, isSuccess, isError]);

    return (
        <div className="container">
            <Header />

            <div className="content">
                {isDispute ? (
                    <SupportChatModal
                        successDispute={() => setIsDispute(false)}
                        failedDispute={() => {
                            if (BFData.data.fail_url) {
                                window.location.replace(BFData.data.fail_url);
                            } else {
                                nav(c.PAGE_PAYOUT_NOT_FOUND, { replace: true });
                            }
                        }}
                    />
                ) : (
                    <>
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

                        {showPayoutSubmit && (
                            <PayoutSubmitModal
                                data={{
                                    title: `${t("transferInAmount", ns)} ${
                                        BFData.lots[BFData.lots.length - 1].amount
                                    }\u00A0${getCurrencySymbol(BFData?.currency)} ${t("transferReceived", ns)}?`,
                                    text: t("approveTransferText", ns),
                                    toggleText: t("approveReceivedCheckbox", ns),
                                    primaryBtnText: t("appreveButtonText", ns),
                                    primaryBtnCallback: () => setSubmitProcess(true),
                                    secondaryBtnText: t("notYet", ns),
                                    loadingButton: submitProcess
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
                                callback: () =>
                                    import.meta.env.VITE_DISPUT_CHAT
                                        ? setIsDispute(true)
                                        : supportDialog.setIsActive(true)
                            }}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default PayOutPage;
