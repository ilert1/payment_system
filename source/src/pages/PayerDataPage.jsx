import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";
import PayoutSubmitModal from "../widgets/PayoutSubmitModal";

import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import { CardNumberLast4 } from "../widgets/CardNumberLast4";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const PayerDataPage = () => {
    const {
        navigate,
        setCardNumberLast4,
        cardNumberLast4,
        BFData,
        currentPaymentMethod,
        fingerprintConfig,
        fingerprintReady,
        t
    } = useContext(AppContext);
    // useUrlInfoCheck(navigate);

    //translation
    const ns = { ns: ["Common", "PayerData"] };

    const nav = navigate();

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

    return (
        <div className="container">
            <Header />

            <div className="content">
                <h1 className="grow">{`${t("enter4", ns)} ${
                    currentPaymentMethod?.payment_type == "sbp" ? t("yourPhone", ns) : t("yourCard", ns)
                }`}</h1>
                <CardNumberLast4 onComplete={onComplete} showHidden={currentPaymentMethod?.payment_type != "sbp"} />
            </div>

            {showPayoutSubmit && <PayoutSubmitModal closeModal={() => setShowPayoutSubmit(false)} />}

            <Footer
                buttonCaption={t("approve", ns)}
                buttonCallback={buttonCallback}
                nextPage={c.PAGE_PAYEE_SEARCH}
                // prevPage={c.PAGE_PAYMENT_INSTRUMENT}
                nextEnabled={
                    !isFetching_confirmPayIN && (!need_startPayIN || (need_startPayIN && data_startPayIN)) && isComplete
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
