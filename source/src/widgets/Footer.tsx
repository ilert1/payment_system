/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import { useAppContext } from "../AppContext";

import ArrowRight from "../shared/assets/images/arrow-right.svg?react";
import ArrowLeft from "../shared/assets/images/arrow-left.svg?react";
import Check from "../shared/assets/images/check.svg?react";
import axios from "axios";
import PayeeInfo from "./PayeeInfo";
import BankCardInfo from "./BankCardInfo";
import SubmitModal from "./SubmitModal";
import { useQuery } from "@tanstack/react-query";

import DefaultBankIcon from "../shared/assets/images/bank-icon.svg";

import { formatedRequisite } from "./PayeeData";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppRoutes } from "@/shared/const/router";
import { useBFStore } from "@/shared/store/bfDataStore";

const bankIcon = (bank: string) => {
    return bank ? `/banks/${bank}.svg` : DefaultBankIcon;
};

interface FooterProps {
    buttonCaption?: string;
    nextPage?: string;
    showCancelBtn?: boolean;
    prevPage?: string;
    nextEnabled?: boolean;
    approve?: boolean;
    focused?: boolean;
    payeeCard?: boolean;
    noIcon?: boolean;
    buttonCallback?: () => void;
}

const Footer = (props: FooterProps) => {
    const {
        buttonCaption = "",
        nextPage,
        showCancelBtn = true,
        prevPage = "",
        nextEnabled = true,
        approve = false,
        focused = false,
        payeeCard = false,
        noIcon = false,
        buttonCallback = () => {}
    } = props;

    const { fingerprintReady, fingerprintConfig, ym, caseName } = useAppContext();
    const BFData = useBFStore(state => state.BFData);

    const navigate = useNavigate();
    const { t } = useTranslation();
    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const trader = BFData?.[dest]?.method?.payee?.data;

    const [requisite, setRequisite] = useState("");

    const returnUrl = BFData?.[dest]?.method?.context?.cancel_redirect_url;

    const [dialogShow, setDialogShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [enabled_cancel, setEnabled_cancel] = useState(false);

    //translation
    const ns = { ns: "Footer" };

    const mainButton = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (focused) {
            mainButton.current?.focus();
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
        if (trader?.iban_number) {
            setRequisite(trader.iban_number);
        }
        console.log(trader);
    }, [trader]);

    let ButtonIcon: SvgComponent | null = ArrowRight;
    if (noIcon) ButtonIcon = null;
    if (approve) ButtonIcon = Check;

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
                    //TODO проверить, думаю этот редирект не нужен, так как выполняется смена статуса через SSE
                    navigate(`/${dest}s/${BFData?.[dest]?.id}/${AppRoutes.CANCEL_PAGE}`, { replace: true });
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
            ym("reachGoal", "cancel-button", { cancel_redirect_url: returnUrl });

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
                            <BankCardInfo
                                bankIcon={bankIcon(trader?.bank_name ?? "")}
                                onError={e => {
                                    e.target.src = DefaultBankIcon;
                                    e.target.classList.remove("logo");
                                }}
                                cardNumber={
                                    formatedRequisite(requisite, !!trader?.phone || !!trader?.phone_number, caseName) ??
                                    ""
                                }
                            />
                            {trader?.card_holder && <PayeeInfo PayeeName={trader?.card_holder} />}
                        </div>
                    )}
                    <div className="buttons-container">
                        {prevPage && (
                            <button
                                id="back-button"
                                className={`button back-button${nextPage == "" ? " grow" : ""}`}
                                onClick={() => {
                                    window.location.replace(prevPage);
                                }}>
                                <ArrowLeft />
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
                                        ym("reachGoal", "main-button", { caption: buttonCaption });
                                        window.location.replace(nextPage);
                                    }
                                }}>
                                {buttonCaption}
                                {ButtonIcon && <ButtonIcon />}
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
