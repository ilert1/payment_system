/* eslint-disable react/prop-types */
import { useContext, useRef, useEffect, useState } from "react";
import AppContext from "../AppContext";

import ArrowRight from "../assets/images/arrow-right.svg";
import ArrowLeft from "../assets/images/arrow-left.svg";
import Check from "../assets/images/check.svg";
import * as c from "../assets/constants.js";
import BankIcon from "../assets/images/bank-icon.svg"; //Sberbank_Logo_2020.svg";

import { PayeeInfo } from "./PayeeInfo";
import { BankCardInfo } from "./BankCardInfo";
import ym from "react-yandex-metrika";
import PayoutSubmitModal from "./PayoutSubmitModal";

const Footer = ({
    buttonCaption = "",
    nextPage = "",
    //backButton = false,
    prevPage = "",
    nextEnabled = true,
    approve = false,
    focused = false,
    payeeCard = false,
    noIcon = false,
    buttonCallback = null
}) => {
    const navigate = useContext(AppContext).navigate();
    // const { traderData, currentPaymentMethod, t, BFData } = useContext(AppContext);
    const { BFData, t } = useContext(AppContext);

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const trader = BFData?.[dest]?.method?.payee?.data;
    const [requisite, setRequisite] = useState(null);

    const returnUrl = BFData?.return_url;

    // const currPayMethod = JSON.parse(currentPaymentMethod);

    const [dialogShow, setDialogShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // const [enabled_cancel, setEnabled_cancel] = useState(false);

    const cancelRequestIgnore = false;

    //translation
    const ns = { ns: "Footer" };

    const mainButton = useRef();

    useEffect(() => {
        if (focused) {
            mainButton.current.focus();
        }
    }, [focused]);

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

    let buttonIcon = ArrowRight;
    if (noIcon) buttonIcon = null;
    if (approve) buttonIcon = Check;

    const submitModalData = {
        title: t("cancelDialog.title", ns),
        text: t("cancelDialog.text", ns),
        primaryBtnText: t("cancel", ns),
        primaryBtnCallback: () => {
            if (import.meta.env.VITE_YMETRICS_COUNTER) {
                ym("reachGoal", "cancel-button", { returnUrl: returnUrl });
            }
            if (cancelRequestIgnore) {
                if (returnUrl) {
                    setIsLoading(true);
                    window.location.href = returnUrl;
                } else {
                    navigate(c.PAGE_CANCEL, { replace: true });
                }
            } else {
                setIsLoading(true);
                // setEnabled_cancel(true);
            }
        },
        secondaryBtnText: t("cancelDialog.continue", ns),
        secondaryBtnCallback: () => {
            setDialogShow(false);
        }
    };

    // const { data: data_cancel, isFetching: isFetching_cancel } = useQuery({
    //     queryKey: ["cancel"],
    //     enabled: enabled_cancel && fingerprintReady,
    //     refetchOnWindowFocus: false,
    //     queryFn: async () => {
    //         console.log("cancel");
    //         let payload = BFData;
    //         const { trn, wf } = payload;
    //         payload = {
    //             message: {
    //                 payment: {
    //                     trn: trn
    //                 }
    //             }
    //         };
    //         console.log("cancel payload:");
    //         console.log(payload);

    //         const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/cancel`, payload, fingerprintConfig);
    //         console.log("cancel response:");
    //         console.log(data);

    //         if (data?.success) {
    //             if (returnUrl) {
    //                 window.location.replace = returnUrl;
    //             } else {
    //                 navigate(c.PAGE_CANCEL, { replace: true });
    //             }
    //         } else {
    //             if (BFData?.fail_url) {
    //                 document.location.replace(BFData.fail_url);
    //             } else {
    //                 nav(c.PAGE_GENERAL_ERROR, { replace: true });
    //             }
    //         }
    //         setIsLoading(false);

    //         return data;
    //     }
    // });

    return (
        <>
            <footer>
                <div className={`top${(prevPage || nextPage) && payeeCard ? " big-footer-container" : ""}`}>
                    {payeeCard && (
                        <div className="payee-data">
                            <BankCardInfo BankIcon={BankIcon} cardNumber={requisite} />
                            {trader?.card_holder && (
                                <PayeeInfo
                                    PayeeName={trader?.card_holder}
                                    showPayeeData={trader?.card_number || trader?.iban || trader?.account_number}
                                />
                            )}
                        </div>
                    )}
                    <div className="buttons-container">
                        {prevPage && (
                            <button
                                id="back-button"
                                className={`button back-button${nextPage == "" ? " grow" : ""}`}
                                onClick={() => {
                                    navigate(prevPage, { replace: true });
                                }}>
                                <img src={ArrowLeft} alt="" />
                            </button>
                        )}

                        {nextPage && (
                            <button
                                id="main-button"
                                ref={mainButton}
                                className={`button main-button ${!nextEnabled ? "disabled" : ""}`}
                                onClick={() => {
                                    if (buttonCallback) {
                                        buttonCallback();
                                    } else {
                                        if (import.meta.env.VITE_YMETRICS_COUNTER) {
                                            ym("reachGoal", "main-button", { caption: buttonCaption });
                                        }
                                        navigate(nextPage, { replace: true });
                                    }
                                }}>
                                {buttonCaption}
                                {buttonIcon && <img src={buttonIcon} alt="" />}
                            </button>
                        )}
                        <button
                            id="cancel-button"
                            className={`button cancel-button no-bg`}
                            onClick={() => {
                                setDialogShow(true);
                            }}>
                            {submitModalData?.primaryBtnText}
                            {/* <img src={CancelIcon} alt="" /> */}
                        </button>
                    </div>
                </div>
            </footer>

            {payOutMode && (
                <PayoutSubmitModal
                    show={dialogShow}
                    setShow={setDialogShow}
                    data={submitModalData}
                    isLoading={isLoading}
                />
            )}
        </>
    );
};

export default Footer;
