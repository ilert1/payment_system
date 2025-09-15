import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/AppContext";
import { CardNumberForm } from "@/features/CardNumberForm";
import { useCardFormStore } from "@/features/CardNumberForm/model/slice/CardFormSlice";
import { CardNumberLast4 } from "@/features/CardNumberLast4";
import { AppRoutes } from "@/shared/const/router";
import { useBFStore } from "@/shared/store/bfDataStore";
import { Heading } from "@/shared/ui/Heading/Heading";
import Loader from "@/shared/ui/Loader/Loader";
import { useFooterStore } from "@/widgets/Footer/model/slice/FooterSlice";
import { useCardNumberFormsStore } from "../model/slice/CardNumberFormsSlice";

export const CardNumberForms = () => {
    const { ym, fingerprintConfig } = useAppContext();
    const navigate = useNavigate();
    const { t } = useTranslation(["PayerDataPage"]);
    const ns = { ns: ["Common", "PayerData", "PayOut"] };

    const setFooter = useFooterStore(state => state.setFooter);

    const BFData = useBFStore(state => state.BFData);
    const status = useBFStore(state => state.status);

    const { isFetching, fetchPaymentInit } = useCardNumberFormsStore();
    const { cardNumber, expiryDate, cvv, cardHolder, submitPayerData } = useCardFormStore();

    const [isPressed, setIsPressed] = useState(false);

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const method = BFData?.[dest]?.method;
    const methodName = method?.name;
    const redirectUrl = BFData?.[dest]?.method?.payee?.redirect_url ?? "";
    const isEcom = methodName?.includes("ecom");
    const context = method?.context;
    const requiredCompleted = cardNumber.length === 19 && cvv.length === 3 && expiryDate.length === 5;
    const cardHolderOk = /^[a-zA-Z]+\s[a-zA-Z]+$/.test(cardHolder);
    const isPlatformCard = methodName === "ecom_platform_card" || methodName === "ecom";
    const waitTransfer = status === "paymentAwaitingTransfer";
    const showCardHolder = context?.provider === "BNNPay" || context?.provider === "FakeGoAdapter";
    const isSbp = methodName === "sbp";

    const nextEnabled = isEcom
        ? waitTransfer
            ? true
            : !(isPressed || isFetching) && (showCardHolder ? requiredCompleted && cardHolderOk : requiredCompleted)
        : false;

    const handleSubmit = async () => {
        if (isPressed) return;
        setIsPressed(true);

        await submitPayerData(
            {
                cardNumber,
                expiryDate,
                cvv,
                cardHolder,
                dest
            },
            BFData?.[dest]?.method?.name ?? "",
            dest,
            ym,
            t
        );

        setIsPressed(false);
    };

    const redirectCallback = () => {
        ym("reachGoal", "external-redirect", { redirect_url: redirectUrl });

        window.open(redirectUrl, "_blank");
    };

    useEffect(() => {
        const bfId = BFData?.[dest]?.id;

        if (waitTransfer && isEcom && bfId) {
            fetchPaymentInit({
                dest,
                bfId,
                navigate,
                payOutMode,
                fingerprintConfig
            });
        }
    }, [waitTransfer, isEcom, BFData?.[dest]?.id]);

    useEffect(() => {
        if (isFetching) return;
        console.log("Setting footer: ", nextEnabled);

        setFooter({
            buttonCallback: isEcom && redirectUrl ? redirectCallback : handleSubmit,
            isUnicalization: false,
            buttonCaption: !redirectUrl ? t("approve", ns) : t("pay", ns),
            nextPage: AppRoutes.PAYEE_SEARCH_PAGE,
            nextEnabled: !redirectUrl && isPlatformCard && waitTransfer ? false : nextEnabled,
            approve: true,
            focused: false,
            showCancelBtn: status === "paymentPayerDataEntrу"
        });
    }, [isFetching, BFData, isEcom, redirectUrl, isPlatformCard, waitTransfer, nextEnabled]);

    return isEcom ? (
        !isFetching && !waitTransfer ? (
            <>
                <Heading size="l" title={t("enterYourCard", ns)} grow />
                <CardNumberForm disabled={isPressed || isFetching} cardHolderVisible={showCardHolder} />
            </>
        ) : (
            <>
                <Heading size="l" title={t("getCard", ns)} grow />
                {(isPressed || isFetching) && <Loader />}
            </>
        )
    ) : (
        <>
            <Heading size="l" title={`${t("enter4", ns)} ${isSbp ? t("yourPhone", ns) : t("yourCard", ns)}`} grow />
            <CardNumberLast4 onComplete={() => {}} showHidden={!isSbp} />
        </>
    );
};
