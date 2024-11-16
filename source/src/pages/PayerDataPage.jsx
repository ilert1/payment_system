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
    // useUrlInfoCheck(navigate);

    //translation
    const ns = { ns: ["Common", "PayerData", "PayOut"] };

    const nav = navigate();

    useEffect(() => {
        const paymentPage = paymentEcomPage();

        if (paymentPage && !window.location.pathname.includes(paymentPage)) {
            nav("../" + paymentPage, { replace: true });
        }
    }, [nav, paymentEcomPage]);

    const [isComplete, setIsComplete] = useState(false);
    const [payoutMode, setPayoutMode] = useState(false);
    const [showPayoutSubmit, setShowPayoutSubmit] = useState(false);
    const [buttonFocused, setButtonFocused] = useState(false);

    const [enabled_startPayIN, setEnabled_startPayIN] = useState(false);
    const [need_startPayIN, setNeed_startPayIN] = useState(false);
    const [enabled_confirmPayIN, setEnabled_confirmPayIN] = useState(false);

    const onComplete = numbers => {
        setIsComplete(true);
        setButtonFocused(true);
        setCardNumberLast4(numbers);
    };

    useEffect(() => {
        if (window.location.pathname.includes("/payouts")) {
            setPayoutMode(true);
        }

        if (currentPaymentMethod?.bank) {
            setEnabled_startPayIN(true);
            setNeed_startPayIN(true);
        } else {
            setNeed_startPayIN(false);
        }
    }, []);

    const { data: data_startPayIN, isFetching: isFetching_startPayIN } = useQuery({
        queryKey: ["startPayIN"],
        enabled: enabled_startPayIN && fingerprintReady,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            console.log("startPayIN");
            let payload = BFData;
            const { trn } = payload;
            payload = {
                message: {
                    payment: {
                        bank: currentPaymentMethod?.bank,
                        trn: trn,
                        type: currentPaymentMethod?.payment_type //"card2card",
                        // wf: wf
                    }
                }
            };

            console.log("startPayIN payload:");
            console.log(payload);

            // const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/startPayIN`, payload, fingerprintConfig);

            //response mock
            const data = {
                success: true
            };

            console.log("startPayIN response:");
            console.log(data);

            nav(`../${c.PAGE_PAYER_DATA}`, { replace: true });
            return data;
        }
    });

    const { data: data_confirmPayIN, isFetching: isFetching_confirmPayIN } = useQuery({
        queryKey: ["confirmPayIN"],
        enabled: enabled_confirmPayIN && fingerprintReady,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            console.log("confirmPayIN");
            let payload = BFData;
            const { trn, wf } = payload;
            payload = {
                message: {
                    payment:
                        currentPaymentMethod?.payment_type != "sbp"
                            ? {
                                  trn: trn,
                                  customerCardLastDigits: cardNumberLast4
                              }
                            : {
                                  trn: trn,
                                  customerPhoneLastDigits: cardNumberLast4
                              }
                }
            };
            console.log("confirmPayIN payload:");
            console.log(payload);

            /* const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/confirmPayIN`,
                payload,
                fingerprintConfig
            ); */

            //response mock
            const data = {
                success: true
            };

            console.log("confirmPayIN response:");
            console.log(data);

            if (data?.success) {
                nav(`../${c.PAGE_PAYEE_SEARCH}`, { replace: true });
            } else {
                if (BFData?.fail_url) {
                    document.location.replace(BFData.fail_url);
                } else {
                    nav(`../${c.PAGE_GENERAL_ERROR}`, { replace: true });
                }
            }
            return data;
        }
    });

    const buttonCallback = () => {
        if (payoutMode) {
            setShowPayoutSubmit(true);
        } else {
            setEnabled_confirmPayIN(true);
        }
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
    } = useGetCardNumberFormData();

    const handleSubmit = () => {
        console.log(errors);
        console.log(1);
    };

    return (
        <div className="container">
            <Header />

            <div className="content cardPage">
                {currentPaymentMethod?.payment_type !== "ecom" ? (
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
                            currentPaymentMethod?.payment_type == "sbp" ? t("yourPhone", ns) : t("yourCard", ns)
                        }`}</h1>
                        <CardNumberLast4
                            onComplete={onComplete}
                            showHidden={currentPaymentMethod?.payment_type != "sbp"}
                        />
                    </>
                )}
            </div>

            {showPayoutSubmit && (
                <PayoutSubmitModal
                    data={{
                        title: "Проверьте реквизиты!",
                        text: "Если вы не верно указали реквизиты, вы безвозвратно потеряте средства",
                        cardNumber: "1234 1234 1234 1234",
                        toggleText: "Реквизиты указаны верно",
                        primaryBtnText: "Продолжить",
                        primaryBtnCallback: () => {},
                        secondaryBtnText: "Исправить реквизиты"
                    }}
                    closeModal={() => setShowPayoutSubmit(false)}
                />
            )}

            <Footer
                buttonCaption={t("approve", ns)}
                buttonCallback={currentPaymentMethod?.payment_type !== "ecom" ? handleSubmit : buttonCallback}
                nextPage={c.PAGE_PAYEE_SEARCH}
                nextEnabled={
                    currentPaymentMethod?.payment_type !== "ecom"
                        ? !Object.keys(errors).length && cardNumber.length && cvv.length && expiryDate.length
                        : !isFetching_confirmPayIN &&
                          (!need_startPayIN || (need_startPayIN && data_startPayIN)) &&
                          isComplete
                        ? true
                        : false
                }
                approve={true}
                focused={buttonFocused}
            />
        </div>
    );
};

export default PayerDataPage;
