import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useAppContext } from "@/AppContext";
import usePaymentPage from "@/hooks/usePaymentPage";
import { AppRoutes } from "@/shared/const/router";
import { useBFStore } from "@/shared/store/bfDataStore";
import { Footer } from "@/widgets/Footer";
import { Header } from "@/widgets/Header";
import { PayInstruments } from "@/widgets/PayInstruments";
import styles from "./PaymentInstrumentPage.module.scss";

const PaymentInstrumentPage = () => {
    const { currentPaymentInstrument, fingerprintConfig, getCurrencySymbol, fingerprintReady, t, ym } = useAppContext();
    const BFData = useBFStore(state => state.BFData);

    //translation
    const ns = { ns: ["Common", "PaymentInstrument"] };

    // Stex piti lini paymentInstruments
    const [paymentInstruments, setPaymentInstruments] = useState<PaymentInstrument[] | null>(null);
    const [instrumentSelectedEnable, setInstrumentSelectedEnable] = useState(false);

    usePaymentPage({ absolutePath: false });

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const baseApiURL = import.meta.env.VITE_API_URL;

    const { data, isFetching } = useQuery({
        queryKey: ["getPaymentInstruments"],
        refetchOnWindowFocus: false,
        retry: true,
        enabled: fingerprintReady,
        queryFn: async () => {
            console.log("send event: paymentPayerGetInstruments");
            const payload = {
                paymentId: BFData?.[dest]?.id,
                event: "paymentPayerGetInstruments"
            };

            const { data } = await axios.post(
                `${baseApiURL}/${dest}s/${BFData?.[dest]?.id}/events`,
                payload,
                fingerprintConfig
            );
            console.log("paymentPayerGetInstruments response:");
            console.log(data);
            setPaymentInstruments(data?.data?.payment_instruments);
            return data;
        }
    });

    const { isLoading: instrumentSelected_isFetching } = useQuery({
        queryKey: ["paymentPayerSelectedInstrument"],
        refetchOnWindowFocus: false,
        retry: true,
        enabled: instrumentSelectedEnable && fingerprintReady,
        queryFn: async () => {
            console.log("send event: paymentPayerSelectedInstrument");
            if (currentPaymentInstrument?.data?.bank) {
                const payload = {
                    bank: currentPaymentInstrument?.data?.bank,
                    payment_type: currentPaymentInstrument?.data?.payment_type
                };

                console.log("paymentPayerSelectedInstrument payload:");
                console.log(payload);

                const { data } = await axios
                    .post(
                        `${baseApiURL}/${dest}s/${BFData?.[dest]?.id}/events`,
                        {
                            paymentId: BFData?.[dest]?.id,
                            event: "paymentPayerSelectedInstrument",
                            payload: payload
                        },
                        fingerprintConfig
                    )
                    .catch(e => {
                        console.log(e);
                    });
                console.log(data);
                return data;
            }
        }
    });

    const buttonCallback = async () => {
        ym("reachGoal", "main-button", { caption: t("next", ns), payment_method: currentPaymentInstrument?.data });
        setInstrumentSelectedEnable(true);
    };

    return (
        <div className="container">
            <Header />
            <div className="content">
                <h1>{t("amount", ns)}</h1>
                <div className={styles.amountContainer}>
                    <p className={styles.amount}>{BFData?.[dest]?.amount}</p>
                    <p className="currency">&nbsp;{getCurrencySymbol(BFData?.[dest]?.currency ?? "")}</p>
                </div>
                <PayInstruments isFetching={isFetching} paymentInstruments={paymentInstruments ?? []} />
            </div>

            <Footer
                buttonCaption={t("next", ns)}
                buttonCallback={buttonCallback}
                nextPage={`/${BFData?.[dest]?.id}/${AppRoutes.PAYER_DATA_PAGE}`}
                nextEnabled={!instrumentSelected_isFetching && currentPaymentInstrument?.data != null ? true : false}
            />
        </div>
    );
};

export default PaymentInstrumentPage;
