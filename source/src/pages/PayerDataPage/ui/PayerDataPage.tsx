import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/AppContext";
import usePaymentPage from "@/hooks/usePaymentPage";
import { AppRoutes } from "@/shared/const/router.js";
import { useBFStore } from "@/shared/store/bfDataStore.js";
import Loader from "@/shared/ui/Loader";
import { CardNumberForm } from "@/widgets/CardNumberForm";
import { usePayerDataStore } from "@/widgets/CardNumberForm/model/slice/CardNumberFormSlice";
import { CardNumberLast4 } from "@/widgets/CardNumberLast4";
import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets/Header";
import { Page } from "@/widgets/Page";
import { usePaymentStore } from "../model/slice/PayerDataPageSlice";

const PayerDataPage = () => {
    const { t, ym, fingerprintConfig } = useAppContext();
    ym("reachGoal", "payer-data-page");

    const status = useBFStore(state => state.status);
    const navigate = useNavigate();
    usePaymentPage({ absolutePath: false });

    const BFData = useBFStore(state => state.BFData);
    const { cardNumber, expiryDate, cvv, cardHolder, submitPayerData } = usePayerDataStore();
    const { fetchPaymentInit, isFetching } = usePaymentStore();

    const [isComplete, setIsComplete] = useState(false);
    const [buttonFocused, setButtonFocused] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    //translation
    const ns = { ns: ["Common", "PayerData", "PayOut"] };

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const waitTransfer = status === "paymentAwaitingTransfer";

    const requiredCompleted = cardNumber.length === 19 && cvv.length === 3 && expiryDate.length === 5;
    const cardHolderOk = /^[a-zA-Z]+\s[a-zA-Z]+$/.test(cardHolder);

    const method = BFData?.[dest]?.method;
    const methodName = method?.name;
    const context = method?.context;

    const isEcom = methodName?.includes("ecom");
    const redirectUrl = BFData?.[dest]?.method?.payee?.redirect_url ?? "";

    const showCardHolder = context?.provider === "BNNPay";
    const isSbp = methodName === "sbp";

    const nextEnabled = isEcom
        ? waitTransfer
            ? true
            : !(isPressed || isFetching) && (showCardHolder ? requiredCompleted && cardHolderOk : requiredCompleted)
        : isComplete;

    const onComplete = (numbers: string) => {
        setIsComplete(true);
        setButtonFocused(true);
        // setCardNumberLast4(numbers);
    };

    const handleSubmit = () => {
        submitPayerData(
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
    };

    const buttonCallback = () => {
        setIsPressed(true);
        handleSubmit();
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
        if (waitTransfer) {
            setIsPressed(false);
        }
    }, [waitTransfer]);

    return (
        <Page>
            <div className="content cardPage">
                {isEcom ? (
                    !isFetching && !waitTransfer ? (
                        <>
                            <h1 className="grow">{t("enterYourCard", ns)}</h1>
                            <CardNumberForm disabled={isPressed || isFetching} cardHolderVisible={showCardHolder} />
                        </>
                    ) : (
                        <>
                            <h1 className="grow">{t("getCard", ns)}</h1>
                            {(isPressed || isFetching) && (
                                <div className="loader-container">
                                    <Loader />
                                </div>
                            )}
                        </>
                    )
                ) : (
                    <>
                        <h1 className="grow">{`${t("enter4", ns)} ${
                            isSbp ? t("yourPhone", ns) : t("yourCard", ns)
                        }`}</h1>
                        <CardNumberLast4 onComplete={onComplete} showHidden={!isSbp} />
                    </>
                )}
            </div>
            {!isFetching && (
                <Footer
                    buttonCaption={!redirectUrl ? t("approve", ns) : t("pay", ns)}
                    buttonCallback={isEcom && redirectUrl ? redirectCallback : buttonCallback}
                    nextPage={AppRoutes.PAYEE_SEARCH_PAGE}
                    nextEnabled={nextEnabled}
                    approve={true}
                    focused={buttonFocused}
                    showCancelBtn={!(methodName === "ecom_platform_card")}
                />
            )}
        </Page>
    );
};

export default PayerDataPage;
