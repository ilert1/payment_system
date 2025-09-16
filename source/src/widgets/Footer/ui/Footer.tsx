/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import axios, { isCancel } from "axios";
import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "@/AppContext";
import ArrowLeft from "@/shared/assets/images/arrow-left.svg?react";
import ArrowRight from "@/shared/assets/images/arrow-right.svg";
import DefaultBankIcon from "@/shared/assets/images/bank-icon.svg";
import Check from "@/shared/assets/images/check.svg";
import { AppRoutes } from "@/shared/const/router";
import { classNames } from "@/shared/lib/classNames";
import { formatedRequisite } from "@/shared/lib/formattedRequisite";
import { useBFStore } from "@/shared/store/bfDataStore";
import { Button } from "@/shared/ui/Button/Button";
import { BankCardInfo } from "@/widgets/BankCardInfo";
import { PayeeInfo } from "@/widgets/PayeeInfo";
import { SubmitModal } from "@/widgets/SubmitModal";
import styles from "./Footer.module.scss";

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
    hideRequisite?: boolean;
    isUnicalization?: boolean;
}

export const Footer = (props: FooterProps) => {
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
        buttonCallback = () => {},
        hideRequisite = false,
        isUnicalization = false
    } = props;

    const { fingerprintReady, fingerprintConfig, ym, caseName } = useAppContext();
    const BFData = useBFStore(state => state.BFData);
    const setStatus = useBFStore(state => state.setStatus);

    const navigate = useNavigate();
    const { t } = useTranslation(["Footer"]);
    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const trader = BFData?.[dest]?.method?.payee?.data;

    const [requisite, setRequisite] = useState("");

    const returnUrl = BFData?.[dest]?.method?.context?.cancel_redirect_url;

    const [dialogShow, setDialogShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [enabled_cancel, setEnabled_cancel] = useState(false);

    const [unicPopupShow, setUnicPopupShow] = useState(isUnicalization);

    useEffect(() => {
        if (isUnicalization && unicPopupShow) {
            ym("reachGoal", "unic-popup", {
                amount: BFData?.[dest]?.amount,
                original_amount: BFData?.[dest]?.original_amount
            });
        }
    }, [unicPopupShow]);

    //translation
    const ns = { ns: ["Footer", "Pay", "Common"] };

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

    let ButtonIcon: string | null = ArrowRight;
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
                    `${import.meta.env.VITE_API_URL}/${dest}s/${BFData?.[dest]?.id}/events`,
                    {
                        event: "paymentCancel"
                    },
                    fingerprintConfig
                );

                console.log("cancel response:");
                console.log(data);
                if (data?.success) {
                    //TODO проверить, думаю этот редирект не нужен, так как выполняется смена статуса через SSE
                    navigate(`/${dest}s/${BFData?.[dest]?.id}/${AppRoutes.CANCEL_PAGE}`, { replace: true });
                } else {
                    if (data?.error == "8001") {
                        if (data?.state) setStatus(data.state);
                    } else {
                        throw new Error(data?.error_details ? data.error_details : data?.error);
                    }
                }
                return data;
            } catch (e: any) {
                console.error(e?.message);
                ym("reachGoal", "error-message", { error: e?.message });

                toast.error(t("check_load_errors.generalError", ns), {
                    closeButton: <></>,
                    autoClose: 2000
                });
                return e;
            } finally {
                setIsLoading(false);
                setEnabled_cancel(false);
            }
        }
    });

    const cancelModalData = {
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
        },
        isCancel: true,
        closeCallback: () => {
            setDialogShow(false);
        }
    };

    const unicPopupBtnCallback = () => {
        ym("reachGoal", "unic-popup-button", {
            amount: BFData?.[dest]?.amount,
            original_amount: BFData?.[dest]?.original_amount
        });
        setUnicPopupShow(false);
    };

    const unicPopupModalData = {
        title: t("unicPopup.title", ns),
        text: t("unicPopup.text", ns),
        primaryBtnCallback: unicPopupBtnCallback,
        primaryBtnText: t("unicPopup.continue", ns),
        closeCallback: unicPopupBtnCallback
    };

    return (
        <>
            <footer className={styles.footer}>
                <div
                    //  className={`top${(prevPage || nextPage) && payeeCard ? " big-footer-container" : ""}`}
                    className={classNames(styles.top, {
                        [styles.bigFooterContainer]: (prevPage || nextPage) && payeeCard
                    })}>
                    {payeeCard && (requisite || trader?.card_holder) && (
                        <div className={styles.payeeData}>
                            {!hideRequisite && requisite && (
                                <BankCardInfo
                                    bankIcon={bankIcon(trader?.bank_name ?? "")}
                                    onError={e => {
                                        e.target.src = DefaultBankIcon;
                                        e.target.classList.remove("logo");
                                    }}
                                    cardNumber={
                                        formatedRequisite(
                                            requisite,
                                            !!trader?.phone || !!trader?.phone_number,
                                            caseName
                                        ) ?? ""
                                    }
                                />
                            )}
                            {trader?.card_holder && <PayeeInfo PayeeName={trader?.card_holder} />}
                        </div>
                    )}
                    <div className={styles.buttonsContainer}>
                        {/* {prevPage && (
                            <button
                                id="back-button"
                                className={`button back-button${nextPage == "" ? " grow" : ""}`}
                                onClick={() => {
                                    navigate(prevPage, { replace: true });
                                }}>
                                <ArrowLeft />
                            </button>
                        )} */}

                        {nextPage && (
                            <Button
                                size="lg"
                                id="main-button"
                                className={styles.mainButton}
                                ref={mainButton}
                                disabled={!nextEnabled}
                                onClick={() => {
                                    if (buttonCallback) {
                                        buttonCallback();
                                    } else {
                                        ym("reachGoal", "main-button", { caption: buttonCaption });
                                        window.location.replace(nextPage);
                                    }
                                }}>
                                {buttonCaption}
                                {ButtonIcon && <img src={ButtonIcon} alt="" />}
                            </Button>
                        )}

                        {showCancelBtn && (
                            <Button
                                id="cancel-button"
                                className={styles.cancelButton}
                                variant={"ghostDanger"}
                                onClick={() => {
                                    setDialogShow(true);
                                }}>
                                {cancelModalData?.primaryBtnText}
                            </Button>
                        )}
                    </div>
                </div>
            </footer>
            <SubmitModal show={dialogShow} setShow={setDialogShow} data={cancelModalData} isLoading={isLoading} />
            <SubmitModal show={unicPopupShow} setShow={setUnicPopupShow} data={unicPopupModalData} isLoading={false} />
        </>
    );
};
