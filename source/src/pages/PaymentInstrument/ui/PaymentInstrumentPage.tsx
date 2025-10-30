import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAppContext } from "@/AppContext";
import { PayInstruments } from "@/entities/PaymentInstruments";
import { AppRoutes } from "@/shared/const/router";
import { usePaymentPage } from "@/shared/hooks/usePaymentPage";
import { useFooterStore } from "@/shared/store/FooterStore/slice/FooterSlice";
import { useBFStore } from "@/shared/store/bfDataStore";
import { Heading } from "@/shared/ui/Heading/Heading";
import { Text } from "@/shared/ui/Text/Text";
import { Content } from "@/widgets/Content";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";
import styles from "./PaymentInstrumentPage.module.scss";

const PaymentInstrumentPage = () => {
    const { currentPaymentInstrument, fingerprintConfig, getCurrencySymbol, fingerprintReady, t, ym } = useAppContext();
    const BFData = useBFStore(state => state.BFData);
    const setFooter = useFooterStore(state => state.setFooter);

    //translation
    const ns = { ns: ["Common", "PaymentInstrument"] };

    const [paymentInstruments, setPaymentInstruments] = useState<PaymentInstrument[] | null>(null);
    const [instrumentSelectedEnable, setInstrumentSelectedEnable] = useState(false);

    usePaymentPage({ absolutePath: false });

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const baseApiURL = import.meta.env.VITE_API_URL;

    const { isFetching } = useQuery({
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

                const response = await axios
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
                        return null;
                    });
                if (response) {
                    console.log(response.data);
                    return response.data;
                }
                return null;
            }
        }
    });

    const buttonCallback = async () => {
        ym("reachGoal", "main-button", { caption: t("next", ns), payment_method: currentPaymentInstrument?.data });
        setInstrumentSelectedEnable(true);
    };

    useEffect(() => {
        setFooter({
            buttonCaption: t("next", ns),
            buttonCallback: buttonCallback,
            nextPage: `/${BFData?.[dest]?.id}/${AppRoutes.PAYER_DATA_PAGE}`,
            nextEnabled: !instrumentSelected_isFetching && currentPaymentInstrument?.data != null ? true : false,
            isUnicalization: false
        });
    }, []);

    return (
        <Page>
            <Content>
                <Heading size="l" title={t("amount", ns)} grow />
                <div className={styles.amountContainer}>
                    <Text align="right" variant="primary" size="xxl" weight="semiBold" text={BFData?.[dest]?.amount} />
                    <Text
                        text={
                            <>
                                &nbsp;
                                {getCurrencySymbol(BFData?.[dest]?.currency ?? "")}
                            </>
                        }
                    />
                </div>
                <PayInstruments isFetching={isFetching} paymentInstruments={paymentInstruments ?? []} />
            </Content>

            <Footer />
        </Page>
    );
};

export default PaymentInstrumentPage;
