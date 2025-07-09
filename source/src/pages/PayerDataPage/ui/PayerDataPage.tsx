import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";

import { useEffect, useState } from "react";
import { useAppContext } from "@/AppContext";
import { CardNumberLast4 } from "@/widgets/CardNumberLast4";

import axios from "axios";
import { CardNumberForm } from "@/widgets/CardNumberForm";

import { toast } from "react-toastify";
import usePaymentPage from "@/hooks/usePaymentPage";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/shared/ui/Loader";
import { useGetCardNumberFormData } from "@/hooks/useGetCardNumberFormData.js";
import { AppRoutes } from "@/shared/const/router.js";
import { useBFStore } from "@/shared/store/bfDataStore.js";
import { useNavigate } from "react-router-dom";
import { usePayerDataStore } from "@/widgets/CardNumberForm/model/slice/CardNumberFormSlice";

const PayerDataPage = () => {
    const { t, fingerprintConfig, status, ym } = useAppContext();
    const navigate = useNavigate();

    const BFData = useBFStore(state => state.BFData);
    const setBfData = useBFStore(state => state.setBfData);

    const { submitPayerData } = usePayerDataStore();

    //translation
    const ns = { ns: ["Common", "PayerData", "PayOut"] };

    usePaymentPage({ absolutePath: false });

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const [isComplete, setIsComplete] = useState(false);
    const [ecom, setEcom] = useState(BFData?.[dest]?.method?.name === "ecom");

    const [waitTransfer, setWaitTransfer] = useState(status === "paymentAwaitingTransfer");
    const [redirect_url, setRedirect_url] = useState("");
    const [cardHolderVisible, setCardHolderVisible] = useState(BFData?.[dest]?.method?.context?.provider == "BNNPay");

    const [buttonFocused, setButtonFocused] = useState(false);

    const [nextEnabled, setNextEnabled] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const {
        cardNumber,
        expiryDate,
        cvv,
        errors,
        cardHolder,
        handleCardHolderChange,
        register,
        handleCardNumberInputChange,
        handleExpiryInputChange,
        handleExpiryKeyDown,
        handleCvvInputChange
    } = useGetCardNumberFormData({ ns });

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
            dest
        );
    };

    const buttonCallback = () => {
        setIsPressed(true);
        handleSubmit();
    };

    const threeDSCallback = () => {
        ym("reachGoal", "external-redirect", { redirect_url: redirect_url });
        window.open(redirect_url, "_blank");
    };

    useEffect(() => {
        setEcom(BFData?.[dest]?.method?.name === "ecom");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [BFData?.[dest]?.method?.name]);

    useEffect(() => {
        setWaitTransfer(status === "paymentAwaitingTransfer");
    }, [status]);

    useEffect(() => {
        setRedirect_url(BFData?.[dest]?.method?.context?.back_redirect_url ?? "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [BFData?.[dest]?.method?.context?.back_redirect_url]);

    useEffect(() => {
        setCardHolderVisible(BFData?.[dest]?.method?.context?.provider == "BNNPay");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [BFData?.[dest]?.method?.context?.provider]);

    const { isFetching } = useQuery({
        queryKey: ["getPayment"],
        enabled: waitTransfer && ecom,
        refetchOnWindowFocus: false,
        queryFn: async (): Promise<BFDataType | undefined> => {
            const url = `${import.meta.env.VITE_API_URL}/${dest}s/${BFData?.[dest]?.id}`;
            console.log(`getPayment: ${url}`);

            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        ...fingerprintConfig.headers
                    }
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        navigate(`/${payOutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`);
                    }
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const data: BFDataType & { success?: boolean } = await response.json();

                console.log(data);
                console.log("redirect_url", data?.[dest]?.method?.payee?.redirect_url);

                if (data?.success) {
                    setBfData(data);
                    return data;
                } else {
                    navigate(`/${payOutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`);
                }
            } catch (error) {
                console.error("Fetch error", error);
                return undefined;
            }
        }
    });

    useEffect(() => {
        if (waitTransfer) {
            setIsPressed(false);
        }
    }, [waitTransfer]);

    useEffect(() => {
        if (ecom) {
            if (waitTransfer) {
                setNextEnabled(true);
            } else {
                if (isPressed || isFetching) {
                    setNextEnabled(false);
                } else {
                    // const errorsCount = Object.keys(errors)?.length;
                    const requiredCompleted = cardNumber.length === 19 && cvv.length === 3 && expiryDate.length === 5;
                    const cardHolderOk = /^[a-zA-Z]+\s[a-zA-Z]+$/.test(cardHolder);

                    setNextEnabled(cardHolderVisible ? requiredCompleted && cardHolderOk : requiredCompleted);
                }
            }
        } else {
            setNextEnabled(isComplete);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardNumber, expiryDate, cvv, cardHolder, isComplete, errors, ecom, waitTransfer, isFetching, isPressed]);

    return (
        <div className="container">
            <Header />
            <div className="content cardPage">
                {ecom ? (
                    !isFetching && !waitTransfer ? (
                        <>
                            <h1 className="grow">{t("enterYourCard", ns)}</h1>
                            <CardNumberForm
                                register={register}
                                errors={errors}
                                cardNumber={cardNumber}
                                expiryDate={expiryDate}
                                handleCardNumberInputChange={handleCardNumberInputChange}
                                handleExpiryInputChange={handleExpiryInputChange}
                                handleExpiryKeyDown={handleExpiryKeyDown}
                                handleCvvInputChange={handleCvvInputChange}
                                cvv={cvv}
                                cardHolder={cardHolder}
                                handleCardHolderChange={handleCardHolderChange}
                                disabled={isPressed || isFetching}
                                cardHolderVisible={cardHolderVisible}
                            />
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
                            BFData?.[dest]?.method?.name == "sbp" ? t("yourPhone", ns) : t("yourCard", ns)
                        }`}</h1>
                        <CardNumberLast4 onComplete={onComplete} showHidden={BFData?.[dest]?.method?.name != "sbp"} />
                    </>
                )}
            </div>
            {!isFetching && (
                <Footer
                    buttonCaption={!redirect_url ? t("approve", ns) : t("pay", ns)}
                    buttonCallback={ecom && redirect_url ? threeDSCallback : ecom ? handleSubmit : buttonCallback}
                    nextPage={AppRoutes.PAYEE_SEARCH_PAGE}
                    nextEnabled={nextEnabled}
                    approve={true}
                    focused={buttonFocused}
                />
            )}
        </div>
    );
};

export default PayerDataPage;
