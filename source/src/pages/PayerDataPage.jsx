import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";
import PayoutSubmitModal from "../widgets/PayoutSubmitModal";

import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { CardNumberLast4 } from "../widgets/CardNumberLast4";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CardNumberForm } from "../widgets/CardNumberForm.jsx";
import { useGetCardNumberFormData } from "../widgets/useGetCardNumberFormData.js";
import FooterOld from "../widgets/FooterOld.jsx";

import { toast } from "react-toastify";
import usePaymentPage from "../hooks/usePaymentPage.jsx";

const baseUrl = import.meta.env.VITE_API_URL;

const PayerDataPage = () => {
    const {
        navigate,
        setCardNumberLast4,
        cardNumberLast4,
        BFData,
        currentPaymentMethod,
        fingerprintConfig,
        paymentEcomPage,
        fingerprintReady,
        t
    } = useContext(AppContext);

    //translation
    const ns = { ns: ["Common", "PayerData", "PayOut"] };

    const nav = navigate();

    usePaymentPage({ absolutePath: false });

    const [isComplete, setIsComplete] = useState(false);
    // const [payoutMode, setPayoutMode] = useState(false);
    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const [showPayoutSubmit, setShowPayoutSubmit] = useState(false);
    const [buttonFocused, setButtonFocused] = useState(false);

    const [nextEnabled, setNextEnabled] = useState(false);

    const onComplete = numbers => {
        setIsComplete(true);
        setButtonFocused(true);
        setCardNumberLast4(numbers);
    };

    const {
        cardNumber,
        expiryDate,
        cvv,
        errors,
        register,
        setCardNumber,
        setExpiryDate,
        onSubmit,
        handleCardNumberInputChange,
        handleExpiryInputChange,
        handleExpiryKeyDown,
        handleCvvInputChange
    } = useGetCardNumberFormData(t, ns);

    const handleSubmit = async () => {
        let payload = {};
        switch (BFData?.method?.name) {
            case "ecom":
                payload = {
                    payment: {
                        method: {
                            payer: {
                                data: {
                                    card_number: cardNumber.replace(/\s+/g, ""),
                                    card_expiration_date: `20${expiryDate.slice(3)}-${expiryDate.slice(0, 2)}`,
                                    card_security_code: cvv
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

        const url = `${baseUrl}/${dest}s/${BFData?.[dest]?.id}/events`;
        try {
            const data = await axios.post(url, {
                event: "paymentPayerDataEntered",
                payload: payload
            });
            if (!data.data.success) {
                console.log(data.data.error);
                /* const match = data.data.error.match(/code=(\d+)/);
                const errorCode = match[1];
                if (errorCode === "404") throw new Error(t("errors.paymentNotFound", { ns: ["PayerData"] }));
                else throw new Error(t("errors.unknownError", { ns: ["PayerData"] })); */
            }
        } catch (error) {
            toast.error(error.message, { autoClose: 2000, closeButton: <></> });
        }
    };

    const buttonCallback = () => {
        if (payOutMode) {
            setShowPayoutSubmit(true);
        } else {
            handleSubmit();
        }
    };

    useEffect(() => {
        BFData?.[dest]?.method?.name === "ecom"
            ? setNextEnabled(
                  !Object.keys(errors).length && cardNumber.length === 19 && cvv.length === 3 && expiryDate.length === 5
              )
            : setNextEnabled(isComplete);
    }, [cardNumber, expiryDate, cvv, isComplete, errors]);

    return (
        <div className="container">
            <Header />

            <div className="content cardPage">
                {BFData?.[dest]?.method?.name === "ecom" ? (
                    <>
                        <h1 className="grow">{t("enterYourCard", ns)}</h1>
                        <CardNumberForm
                            register={register}
                            // handleSubmit={handleSubmit}
                            errors={errors}
                            cardNumber={cardNumber}
                            setCardNumber={setCardNumber}
                            expiryDate={expiryDate}
                            setExpiryDate={setExpiryDate}
                            onSubmit={onSubmit}
                            handleCardNumberInputChange={handleCardNumberInputChange}
                            handleExpiryInputChange={handleExpiryInputChange}
                            handleExpiryKeyDown={handleExpiryKeyDown}
                            handleCvvInputChange={handleCvvInputChange}
                            cvv={cvv}
                        />
                    </>
                ) : (
                    <>
                        <h1 className="grow">{`${t("enter4", ns)} ${
                            BFData?.[dest]?.method?.name == "sbp" ? t("yourPhone", ns) : t("yourCard", ns)
                        }`}</h1>
                        <CardNumberLast4 onComplete={onComplete} showHidden={BFData?.[dest]?.method?.name != "sbp"} />
                    </>
                )}
            </div>

            <Footer
                buttonCaption={t("approve", ns)}
                buttonCallback={BFData?.[dest]?.method?.name !== "ecom" ? handleSubmit : buttonCallback}
                nextPage={c.PAGE_PAYEE_SEARCH}
                nextEnabled={nextEnabled}
                approve={true}
                focused={buttonFocused}
                // prevPage="/"
            />
        </div>
    );
};

export default PayerDataPage;
