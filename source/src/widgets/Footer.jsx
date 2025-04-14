/* eslint-disable react/prop-types */
import { useContext, useRef, useEffect, useState } from "react";
import AppContext from "../AppContext";

import ArrowRight from "../assets/images/arrow-right.svg";
import ArrowLeft from "../assets/images/arrow-left.svg";
import Check from "../assets/images/check.svg";
import BankIcon from "../assets/images/bank-icon.svg"; //Sberbank_Logo_2020.svg";
import axios from "axios";
import { PayeeInfo } from "./PayeeInfo";
import { BankCardInfo } from "./BankCardInfo";
import ym from "react-yandex-metrika";
import SubmitModal from "./SubmitModal.jsx";
import { useQuery } from "@tanstack/react-query";

import * as c from "../assets/constants.js";

const Footer = ({
    buttonCaption = "",
    nextPage = "",
    showCancelBtn = true,
    prevPage = "",
    nextEnabled = true,
    approve = false,
    focused = false,
    payeeCard = false,
    noIcon = false,
    buttonCallback = null
}) => {
    const navigate = useContext(AppContext).navigate();
    const { BFData, t, fingerprintReady, fingerprintConfig } = useContext(AppContext);

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const trader = BFData?.[dest]?.method?.payee?.data;
    const [requisite, setRequisite] = useState(null);

    const returnUrl = BFData?.[dest]?.context?.cancel_redirect_url;

    const [dialogShow, setDialogShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [enabled_cancel, setEnabled_cancel] = useState(false);

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
        if (trader?.phone_number) {
            setRequisite(trader.phone_number);
        }
        if (trader?.iban) {
            setRequisite(trader.iban);
        }
        console.log(trader);
    }, [trader]);

    let buttonIcon = ArrowRight;
    if (noIcon) buttonIcon = null;
    if (approve) buttonIcon = Check;

    useQuery({
        queryKey: ["cancel"],
        enabled: enabled_cancel && fingerprintReady,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            try {
                setIsLoading(true);

                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/cancel`,
                    {
                        message: {
                            payment: {
                                trn: BFData?.[dest]?.id
                            }
                        }
                    },
                    fingerprintConfig
                );

                console.log("cancel response:");
                console.log(data);
                if (data?.success) {
                    navigate(`/${dest}s/${BFData?.[dest]?.id}/${c.PAGE_CANCEL}`, { replace: true });
                }
                return data;
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
                setEnabled_cancel(false);
            }
        }
    });

    const submitModalData = {
        title: t("cancelDialog.title", ns),
        text: t("cancelDialog.text", ns),
        primaryBtnText: t("cancel", ns),
        primaryBtnCallback: () => {
            if (import.meta.env.VITE_YMETRICS_COUNTER) {
                ym("reachGoal", "cancel-button", { cancel_redirect_url: returnUrl });
            }

            setEnabled_cancel(true);
        },
        secondaryBtnText: t("cancelDialog.continue", ns),
        secondaryBtnCallback: () => {
            setDialogShow(false);
        }
    };

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

                        {showCancelBtn && (
                            <button
                                id="cancel-button"
                                className={`button cancel-button no-bg`}
                                onClick={() => {
                                    setDialogShow(true);
                                }}>
                                {submitModalData?.primaryBtnText}
                            </button>
                        )}
                    </div>
                </div>
            </footer>
            <SubmitModal show={dialogShow} setShow={setDialogShow} data={submitModalData} isLoading={isLoading} />
        </>
    );
};

export default Footer;
