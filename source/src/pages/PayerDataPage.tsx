import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";

import { useEffect, useState } from "react";
import { useAppContext } from "@/AppContext";
import { CardNumberLast4 } from "@/widgets/CardNumberLast4";

import axios from "axios";
import { CardNumberForm } from "@/widgets/CardNumberForm";

import { toast } from "react-toastify";
import usePaymentPage from "../hooks/usePaymentPage.jsx";
import { useQuery } from "@tanstack/react-query";
import Loader from "../shared/ui/Loader";
import { useGetCardNumberFormData } from "@/hooks/useGetCardNumberFormData.js";
import { AppRoutes } from "@/shared/const/router.js";
import { useBFStore } from "@/shared/store/bfDataStore.js";

const baseUrl = import.meta.env.VITE_API_URL;

const PayerDataPage = () => {
    const { t, fingerprintConfig, status, ym } = useAppContext();
    const BFData = useBFStore(state => state.BFData);
    const setBfData = useBFStore(state => state.setBfData);

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

    const onComplete = (numbers: string) => {
        setIsComplete(true);
        setButtonFocused(true);
        // setCardNumberLast4(numbers);
    };

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

    const handleSubmit = async () => {
        setIsPressed(true);

        let payload = {};
        switch (BFData?.[dest]?.method?.name) {
            case "ecom":
                payload = {
                    payment: {
                        method: {
                            payer: {
                                data: {
                                    card_number: cardNumber.replace(/\s+/g, ""),
                                    card_lifetime_month: `${expiryDate.slice(0, 2)}`,
                                    card_lifetime_year: `${expiryDate.slice(3)}`,
                                    card_cvc: cvv,
                                    ...(cardHolder.trim() && { card_holder: cardHolder })
                                }
                            }
                        }
                    }
                };
                break;

            case "sbp":
                payload = {
                    payment: {
                        method: {
                            payer: {
                                data: {
                                    phone: cardNumber
                                }
                            }
                        }
                    }
                };
                break;

            case "card2card":
                payload = {
                    payment: {
                        method: {
                            payer: {
                                data: {
                                    card: cardNumber
                                }
                            }
                        }
                    }
                };
                break;

            default:
                break;
        }
        console.log("payload");
        console.log(payload);

        ym("reachGoal", "main-button", { caption: t("approve", ns) });
        if (BFData?.[dest]?.method?.name == "ecom") {
            ym("reachGoal", "ecom-payer-data-entered");
        }

        const url = `${baseUrl}/${dest}s/${BFData?.[dest]?.id}/events`;
        try {
            const data = await axios.post(url, {
                event: "paymentPayerDataEntered",
                payload: payload
            });

            if (!data.data.success) {
                console.log(data.data.error);
            }
        } catch (error: any) {
            toast.error(error.message, { autoClose: 2000, closeButton: <></> });
        }
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
        queryFn: async () => {
            console.log(`getPayment: ${import.meta.env.VITE_API_URL}/${dest}s/${BFData?.[dest]?.id}`);
            try {
                const { data } = await axios
                    .get(`${import.meta.env.VITE_API_URL}/${dest}s/${BFData?.[dest]?.id}`, fingerprintConfig)
                    .catch(e => {
                        console.log(e);
                    });

                console.log(data);
                console.log("redirect_url");
                console.log(data?.[dest]?.method?.payee?.redirect_url);

                if (data) {
                    if (data?.success) {
                        //данные получены успешно
                        setBfData(data);
                    } else {
                        //транзакция не подлежит оплате
                        window.location.replace(
                            `/${payOutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`
                        );
                    }
                }
                return data;
            } catch (e: any) {
                console.error(e.response.statusCode);
                if (e.response.statusCode === 404) {
                    window.location.replace(
                        `/${payOutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`
                    );
                }
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
