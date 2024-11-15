import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";

import AlertTriangle from "../assets/images/alert-triangle.svg";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUrlInfoCheck } from "../widgets/RedirectToMain.jsx";
import PayHeader from "../widgets/PayHeader.jsx";
import PayeeData from "../widgets/PayeeData.jsx";
import Loader from "../ui/Loader.jsx";
import CautionModal from "../widgets/CautionModal.jsx";

const PayPageNew = () => {
    const {
        navigate,
        BFData,
        currentPaymentMethod,
        // traderData,
        // setTraderData,
        t,
        getCurrencySymbol,
        // fingerprintConfig,
        // fingerprintReady,
        directMode
    } = useContext(AppContext);

    const [trader, setTrader] = useState(null);
    // const [enabled_startPayIN, setEnabled_startPayIN] = useState(false);
    // const [enabled_confirmPayIN, setEnabled_confirmPayIN] = useState(false);
    // const [enabled_getTraderData, setEnabled_getTraderData] = useState(false);
    // const [nextEnabled, setNextEnabled] = useState(false);
    const [requisite, setRequisite] = useState(null);

    const [showCaution, setShowCaution] = useState(true);

    const [paymentInstrumentsList, setPaymentInstrumentsList] = useState([]);

    const getBankName = bank => {
        // console.log(paymentInstrumentsList);
        console.log(`bank: ${bank}`);
        if (paymentInstrumentsList.length) {
            let found = paymentInstrumentsList.find(item => item.bank == bank);
            return found ? found?.bank_name : bank;
        }
    };

    //translation
    const ns = { ns: ["Common", "Pay"] };

    useUrlInfoCheck(navigate);

    let currPayMethod;
    if (currentPaymentMethod) {
        currPayMethod = JSON.parse(currentPaymentMethod);
    }
    const nav = navigate();

    useEffect(() => {
        if (trader?.card) {
            setRequisite(trader.card);
        }
        if (trader?.phone) {
            setRequisite(trader.phone);
        }
        if (trader?.account_number) {
            setRequisite(trader.account_number);
        }
        if (trader?.iban) {
            setRequisite(trader.iban);
        }
        console.log(trader);
    }, [trader]);

    // const { data, isFetching } = useQuery({
    //     queryKey: ["getPaymentMethods"],
    //     refetchOnWindowFocus: false,
    //     // retry: true,
    //     enabled: directMode && fingerprintReady,
    //     queryFn: async () => {
    //         console.log("getPaymentMethods");
    //         let payload = BFData;
    //         const { dir, prov, trn, /* wf, */ currency, merchantId } = payload;
    //         payload = {
    //             dir: dir,
    //             prov: prov,
    //             trn: trn,
    //             // wf: wf,
    //             currency: currency,
    //             merchantId: merchantId
    //         };
    //         console.log("BFData.traderData");
    //         console.log(BFData.traderData);

    //         console.log("getPaymentMethods payload:");
    //         console.log(payload);

    //         const { data } = await axios.post(
    //             `${import.meta.env.VITE_API_URL}/getPaymentMethods`,
    //             payload,
    //             fingerprintConfig
    //         );
    //         console.log("getPaymentMethods response:");
    //         console.log(data);

    //         if (data?.success) {
    //             console.log("getPaymentMethods success");
    //             console.log(data?.data?.payment_instruments);
    //             setPaymentInstrumentsList(data?.data?.payment_instruments);
    //             setEnabled_startPayIN(true);
    //         } else {
    //             if (BFData?.fail_url) {
    //                 document.location.replace(BFData.fail_url);
    //             } else {
    //                 nav(c.PAGE_GENERAL_ERROR, { replace: true });
    //             }
    //         }

    //         // setPaymentMethods(data?.data?.payment_instruments);
    //         return data;
    //     },
    //     onError: () => {
    //         console.log("getPaymentMethods error");
    //     }
    // });

    // const { data: data_startPayIN, isFetching: isFetching_startPayIN } = useQuery({
    //     queryKey: ["startPayIN"],
    //     enabled: enabled_startPayIN && trader?.bank && fingerprintReady,
    //     refetchOnWindowFocus: false,
    //     queryFn: async () => {
    //         console.log("startPayIN");
    //         let payload = BFData;
    //         const { trn, payment_type } = payload;
    //         payload = {
    //             message: {
    //                 payment: {
    //                     bank: trader?.bank,
    //                     trn: trn,
    //                     type: payment_type //"card2card",
    //                 }
    //             }
    //         };

    //         console.log("startPayIN payload:");
    //         console.log(payload);

    //         const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/startPayIN`, payload, fingerprintConfig);

    //         console.log("startPayIN response:");
    //         console.log(data);

    //         if (data?.success) {
    //             console.log("confirmPayIN success");
    //             setEnabled_confirmPayIN(true);
    //         } else {
    //             if (BFData?.fail_url) {
    //                 document.location.replace(BFData.fail_url);
    //             } else {
    //                 nav(c.PAGE_GENERAL_ERROR, { replace: true });
    //             }
    //         }

    //         // nav(c.PAGE_PAYER_DATA);
    //         return data;
    //     }
    // });

    // const { data: data_confirmPayIN, isFetching: isFetching_confirmPayIN } = useQuery({
    //     queryKey: ["confirmPayIN"],
    //     enabled: enabled_confirmPayIN && fingerprintReady,
    //     refetchOnWindowFocus: false,
    //     queryFn: async () => {
    //         console.log("confirmPayIN");
    //         let payload = BFData;
    //         const { trn, wf } = payload;

    //         let obj =
    //             BFData.payment_type != "sbp"
    //                 ? {
    //                       trn: trn,
    //                       customerCardLastDigits: "0000"
    //                   }
    //                 : {
    //                       trn: trn,
    //                       customerPhoneLastDigits: "0000"
    //                   };

    //         if (BFData.payment_type != "sbp" && BFData.payment_type != "card2card") {
    //             obj = {
    //                 trn: trn,
    //                 customerCardLastDigits: "0000"
    //             };
    //         }

    //         payload = {
    //             message: {
    //                 payment: obj
    //             }
    //         };
    //         console.log("confirmPayIN payload:");
    //         console.log(payload);

    //         const { data } = await axios.post(
    //             `${import.meta.env.VITE_API_URL}/confirmPayIN`,
    //             payload,
    //             fingerprintConfig
    //         );
    //         console.log("confirmPayIN response:");
    //         console.log(data);

    //         if (data?.success) {
    //             console.log("confirmPayIN success");
    //             setEnabled_getTraderData(true);
    //             // nav(c.PAGE_PAYEE_SEARCH);
    //         } else {
    //             if (BFData?.fail_url) {
    //                 document.location.replace(BFData.fail_url);
    //             } else {
    //                 nav(c.PAGE_GENERAL_ERROR, { replace: true });
    //             }
    //         }
    //         return data;
    //     }
    // });

    // const { data: data_TraderData, isFetching: isFetching_TraderData } = useQuery({
    //     queryKey: ["getTraderData"],
    //     enabled: enabled_getTraderData && fingerprintReady,
    //     retry: false,
    //     refetchOnWindowFocus: false,
    //     queryFn: async () => {
    //         console.log("getTraderData");
    //         let payload = BFData;
    //         const { trn } = payload;
    //         payload = {
    //             trn: trn
    //         };
    //         console.log("getTraderData payload:");
    //         console.log(payload);

    //         const { data } = await axios.post(
    //             `${import.meta.env.VITE_API_URL}/getTraderData`,
    //             payload,
    //             fingerprintConfig
    //         );

    //         // console.log(data?.data);
    //         console.log("getTraderData response:");
    //         console.log(data);

    //         if (data?.success) {
    //             console.log("getTraderData success");
    //             setNextEnabled(true);
    //             console.log(data);
    //             // setTrader(data?.data);
    //             setTraderData(JSON.stringify(data?.data));
    //             /* if (data?.data?.card || data?.data?.phone) {
    //                 setTraderData(JSON.stringify(data?.data));
    //                 nav(c.PAGE_PAY);
    //             } */
    //         } else {
    //             if (BFData?.fail_url) {
    //                 document.location.replace(BFData.fail_url);
    //             } else {
    //                 nav(c.PAGE_GENERAL_ERROR, { replace: true });
    //             }
    //         }
    //         return data;
    //     }
    // });

    return (
        <>
            <div className="container">
                <Header />
                {(!directMode || requisite) && (
                    <>
                        <div className="content">
                            <PayHeader
                                amount={BFData?.amount}
                                currency={getCurrencySymbol(BFData?.currency)}
                                bankName={currPayMethod ? currPayMethod?.bank_name : getBankName(trader?.bank)}
                            />

                            <div className="instructions_new">
                                <ul>
                                    <li>
                                        <span>1. </span>
                                        {t("steps_new.one", ns)}
                                    </li>
                                    <li>
                                        <span>2. </span>
                                        {/* {t("steps.transfer", ns)} {stored?.amount}&nbsp;
                                        {getCurrencySymbol(stored?.currency)} {t("steps.wholeAmount", ns)} */}
                                        {t("steps_new.two", ns)}{" "}
                                        <span>
                                            {currPayMethod ? currPayMethod?.bank_name : getBankName(trader?.bank)}
                                        </span>{" "}
                                        {t("steps_new.onAmount", ns)}{" "}
                                        <span>
                                            {BFData?.amount}&nbsp;
                                            {getCurrencySymbol(BFData?.currency)}
                                        </span>
                                    </li>
                                    <li>
                                        <span>3. </span>
                                        {t("steps_new.pressButton", ns)}
                                        <span>
                                            {' "'}
                                            {t("steps_new.payed", ns)}
                                            {'"'}
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <PayeeData
                                requisite={requisite}
                                trader={trader}
                                bankName={currPayMethod ? currPayMethod?.bank_name : getBankName(trader?.bank)}
                                isPhone={!!trader?.phone}
                            />
                        </div>

                        <Footer
                            buttonCaption={t("approveTransfer", ns)}
                            // buttonCallback={buttonCallback}
                            nextPage={`../${c.PAGE_PAYEE_DATA}`}
                            // prevPage={c.PAGE_PAYMENT_INSTRUMENT}
                            approve={true}
                        />
                    </>
                )}
                {directMode && !trader && (
                    <div className="content">
                        <div className="loader-container">
                            <Loader />
                        </div>
                    </div>
                )}
            </div>
            <CautionModal
                show={showCaution}
                setShow={setShowCaution}
                data={{
                    title: t("attention", ns),
                    buttonText: t("agree", ns),
                    buttonCallback: () => {
                        setShowCaution(false);
                    }
                }}
            />
        </>
    );
};

export default PayPageNew;
