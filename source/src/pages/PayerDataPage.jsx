import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { CardNumberLast4 } from "../widgets/CardNumberLast4";

import axios from "axios";
import { CardNumberForm } from "../widgets/CardNumberForm.jsx";
import { useGetCardNumberFormData } from "../widgets/useGetCardNumberFormData.js";

import { toast } from "react-toastify";
import usePaymentPage from "../hooks/usePaymentPage.jsx";
import { useQuery } from "@tanstack/react-query";
import Loader from "../ui/Loader.jsx";

const baseUrl = import.meta.env.VITE_API_URL;

const PayerDataPage = () => {
    const { setCardNumberLast4, BFData, setBFData, t, fingerprintConfig } = useContext(AppContext);

    //translation
    const ns = { ns: ["Common", "PayerData", "PayOut"] };

    usePaymentPage({ absolutePath: false });

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const [isComplete, setIsComplete] = useState(false);
    const [ecom, setEcom] = useState(BFData?.[dest]?.method?.name === "ecom");

    const [waitTransfer, setWaitTransfer] = useState(BFData?.[dest]?.status === "paymentAwaitingTransfer");
    const [redirect_url, setRedirect_url] = useState("");

    const [buttonFocused, setButtonFocused] = useState(false);

    const [nextEnabled, setNextEnabled] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

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
                                    card_cvc: cvv
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

        const url = `${baseUrl}/${dest}s/${BFData?.[dest]?.id}/events`;
        try {
            const data = await axios.post(url, {
                event: "paymentPayerDataEntered",
                payload: payload
            });

            if (!data.data.success) {
                console.log(data.data.error);
            }
        } catch (error) {
            toast.error(error.message, { autoClose: 2000, closeButton: <></> });
        }
    };

    const buttonCallback = () => {
        setIsPressed(true);
        handleSubmit();
    };

    const threeDSCallback = () => {
        window.open(redirect_url, "_blank");
    };

    useEffect(() => {
        setEcom(BFData?.[dest]?.method?.name === "ecom");
    }, [BFData?.[dest]?.method?.name]);

    useEffect(() => {
        setWaitTransfer(BFData?.[dest]?.status === "paymentAwaitingTransfer");
    }, [BFData?.[dest]?.status]);

    useEffect(() => {
        setRedirect_url(BFData?.[dest]?.method?.payee?.redirect_url);
    }, [BFData?.[dest]?.method?.payee?.redirect_url]);

    useEffect(() => {
        console.log(`getPayment enabled:${ecom && waitTransfer}`);
    }, [ecom, waitTransfer]);

    const { isFetching } = useQuery({
        queryKey: ["getPayment"],
        // refetchInterval: 1000,
        enabled: waitTransfer && ecom,
        // refetchIntervalInBackground: true,
        // retry: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            console.log(`getPayment: ${import.meta.env.VITE_API_URL}/${dest}s/${BFData?.[dest]?.id}`);
            try {
                const { data } = await axios
                    .get(`${import.meta.env.VITE_API_URL}/${dest}s/${BFData?.[dest]?.id}`, fingerprintConfig)
                    .catch(e => {
                        console.log(e);
                    });

                /* const data = {
                    success: true,
                    payment: {
                        id: "2564dbd3-dc17-4713-8bd2-41c70dd9ef48",
                        amount: "992.00",
                        currency: "AZN",
                        method: {
                            name: "ecom",
                            display_name: "Банковский перевод",
                            payer: {
                                schema: {
                                    type: "object",
                                    properties: {
                                        card_cvc: {
                                            type: "string",
                                            description: "Card security code",
                                            format: ""
                                        },
                                        card_lifetime_month: {
                                            type: "string",
                                            description: "Card expiration date month",
                                            format: ""
                                        },
                                        card_lifetime_year: {
                                            type: "string",
                                            description: "Card expiration date year",
                                            format: ""
                                        },
                                        card_number: {
                                            type: "string",
                                            description: "Card number",
                                            format: ""
                                        }
                                    }
                                },
                                required: ["card_number", "card_lifetime_month", "card_lifetime_year", "card_cvc"],
                                data: {
                                    card_cvc: "123",
                                    card_lifetime_month: "11",
                                    card_lifetime_year: "29",
                                    card_number: "4169738851576482"
                                }
                            },
                            payee: {
                                schema: {
                                    type: "",
                                    properties: null
                                },
                                required: null,
                                redirect_url:
                                    "https://imap.inout-sarysu-az.icu/3ds-transaction?id=25135340&secret=a5289598b607ff1cd28f69c3cdf59bb3d02427be51d87c92dbe0f6ec1063953d"
                            },
                            context: {
                                success_redirect_url: "https://merchant-side.com/success",
                                error_redirect_url: "https://merchant-side.com/fail",
                                cancel_redirect_url: "https://merchant-side.com/return"
                            }
                        },
                        status: "paymentAwaitingTransfer",
                        created_at: -62135596800
                    }
                }; */

                console.log(data);
                console.log("redirect_url");
                console.log(data?.[dest]?.method?.payee?.redirect_url);

                if (data) {
                    if (data?.success) {
                        //данные получены успешно
                        setBFData(data);
                    } else {
                        //транзакция не подлежит оплате
                        window.location.replace(c.PAGE_PAYOUT_NOT_FOUND);
                    }
                }
                return data;
            } catch (e) {
                console.error(e.response.statusCode);
                if (e.response.statusCode === 404) {
                    window.location.replace(c.PAGE_PAYOUT_NOT_FOUND);
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
        /* console.log({
            // cardNumber: cardNumber,
            // expiryDate: expiryDate,
            // cvv: cvv,
            isComplete: isComplete,
            // errors: errors,
            ecom: ecom,
            waitTransfer: waitTransfer,
            isFetching: isFetching,
            isPressed: isPressed
        }); */
        if (ecom) {
            if (waitTransfer) {
                setNextEnabled(true);
            } else {
                if (isPressed || isFetching) {
                    setNextEnabled(false);
                } else {
                    setNextEnabled(
                        !Object.keys(errors).length &&
                            cardNumber.length === 19 &&
                            cvv.length === 3 &&
                            expiryDate.length === 5
                    );
                }
            }
        } else {
            setNextEnabled(isComplete);
        }
        console.log(`nextEnabled: ${nextEnabled}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardNumber, expiryDate, cvv, isComplete, errors, ecom, waitTransfer, isFetching, isPressed]);

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
                                disabled={isPressed || isFetching}
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
                    nextPage={c.PAGE_PAYEE_SEARCH}
                    nextEnabled={nextEnabled}
                    approve={true}
                    focused={buttonFocused}
                    // prevPage="/"
                />
            )}
        </div>
    );
};

export default PayerDataPage;
