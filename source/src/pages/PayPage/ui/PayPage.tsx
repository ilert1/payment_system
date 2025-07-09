import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";

import { useEffect, useState } from "react";
import { useAppContext } from "@/AppContext";

import axios from "axios";
import usePaymentPage from "@/hooks/usePaymentPage";
import PayHeader from "@/widgets/PayHeader";
import PayeeData from "@/widgets/PayeeData";
import { getLocalBankName } from "@/Localization";
import Loader from "@/shared/ui/Loader";
import { useQuery } from "@tanstack/react-query";
import { AppRoutes } from "@/shared/const/router";

import { PaymentInstructions } from "./PaymentInstructions";
import { useBFStore } from "@/shared/store/bfDataStore";

const azn = "azn";
const tjs = "tjs";
const iban = "iban";
const abh = "abh";

const PayPage = () => {
    const { fingerprintConfig, t, getCurrencySymbol, caseName, setCaseName, lang } = useAppContext();
    const BFData = useBFStore(state => state.BFData);
    const setBfData = useBFStore(state => state.setBfData);

    //translation
    const ns = { ns: ["Common", "Pay"] };

    usePaymentPage({ absolutePath: false });

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const baseApiURL = import.meta.env.VITE_API_URL;

    const method = BFData?.[dest]?.method;
    const trader = method?.payee?.data;
    const [needRefreshBFData, setNeedRefreshBFData] = useState(false);

    const transgran = ["tsbp", "tcard2card"].includes(method?.name ?? "");

    const [requisite, setRequisite] = useState<string | null>(null);

    const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
    const [bankName, setBankName] = useState("");

    const [buttonCallbackEnabled, setButtonCallbackEnabled] = useState(false);

    const { isFetching: isFetching_ButtonCallback } = useQuery({
        queryKey: ["buttonCallback"],
        enabled: buttonCallbackEnabled,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            try {
                const { data } = await axios
                    .post(
                        `${baseApiURL}/${dest}s/${BFData?.[dest]?.id}/events`,
                        {
                            event: "paymentPayerConfirm"
                        },
                        fingerprintConfig
                    )
                    .catch(e => {
                        console.log(e);
                    });
                console.log(data);
                return data;
            } catch (e) {
                console.log(data?.error);
            } finally {
                setButtonCallbackEnabled(false);
            }
        }
    });

    useEffect(() => {
        console.log(`trader`);
        console.log(trader);

        if (!trader) {
            console.log("needRefreshBFData: true");
            setNeedRefreshBFData(true);
        } else {
            setNeedRefreshBFData(false);
        }
    }, [, trader]);

    useEffect(() => {
        if (trader?.card_number) {
            setRequisite(trader.card_number);
        }
        if (trader?.phone) {
            setRequisite(trader.phone);
        }
        if (trader?.phone_number) {
            setRequisite(trader.phone_number);
        }
        if (trader?.account_number) {
            setRequisite(trader.account_number);
        }
        if (trader?.iban_number) {
            setRequisite(trader.iban_number);
        }
        console.log(trader);
    }, [trader]);

    useEffect(() => {
        setBankName(getLocalBankName(method?.bank?.display_name, lang));
    }, [, method?.bank?.display_name, lang]);

    useEffect(() => {
        setCaseName("");

        console.log(`bankName: ${bankName}`);
        const traderBankName = trader?.bank_name;
        //AZN case check
        if (
            traderBankName &&
            [
                "otherbankaz",
                "mpay",
                "kapitalbank",
                "emanat",
                "leobank",
                "unibank",
                "rabita",
                "abb",
                "birbank",
                "atb",
                "m10"
            ].includes(traderBankName)
        ) {
            setCaseName(azn);
            console.log(`caseName: azn`);
        }

        //TJS case check
        if (
            traderBankName &&
            [
                "tcell",
                "babilon-m",
                "megafon",
                "kortimilli",
                "sanduk",
                "ibt",
                "matin",
                "arvand",
                "favri.cbt",
                "oriyonbonk",
                "vasl",
                "amonatbonk",
                "eskhata",
                "tawhidbank",
                "spitamenbank",
                "dushanbe",
                "alif",
                "humo"
            ].includes(traderBankName)
        ) {
            setCaseName(tjs);
            console.log(`caseName: tjs`);
        }

        //ABH case check
        if (traderBankName && ["a-mobile"].includes(traderBankName)) {
            setCaseName(abh);
            setActiveAccordion(1);
            console.log(`caseName: abh`);
        }

        if (traderBankName && trader?.iban_number) {
            setCaseName(iban);
            console.log(`caseName: iban`);
        }
    }, [BFData?.[dest]?.currency, bankName, trader]);

    const { isFetching: isFetching_BFData } = useQuery({
        queryKey: ["exist"],
        // refetchInterval: BFData?.[dest]?.status === "paymentAwaitingStart" ? 1000 : false,
        enabled: needRefreshBFData,
        // refetchIntervalInBackground: true,
        // retry: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_API_URL}/${dest}s/${BFData?.[dest]?.id}`,
                    fingerprintConfig
                );

                if (data) {
                    if (data?.success) {
                        //данные получены успешно
                        console.log("setBFData");
                        setBfData(data);
                    } else {
                        //транзакция не найдена или не подлежит оплате
                        console.log(data?.error);
                        setNeedRefreshBFData(false);
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
            } finally {
                setNeedRefreshBFData(false);
            }
        }
    });
    console.log("Payee data page", AppRoutes.PAYEE_DATA_PAGE);

    const nextPage = `../${AppRoutes.PAYEE_DATA_PAGE}`;
    console.log(nextPage);

    return (
        <div className="container">
            <Header />
            {!trader || isFetching_BFData ? (
                <div className="content">
                    <div className="loader-container">
                        <Loader />
                    </div>
                </div>
            ) : (
                <>
                    <div className="content">
                        <PayHeader
                            amount={BFData?.[dest]?.amount ?? ""}
                            currency={getCurrencySymbol(BFData?.[dest]?.currency ?? "")}
                            bankName={bankName}
                            countryName={[tjs, azn, abh].includes(caseName) ? caseName : ""}
                            transgran={transgran}
                            timestamp={BFData?.[dest]?.created_at ?? 0}
                        />

                        <PaymentInstructions
                            caseName={caseName}
                            transgran={transgran}
                            trader={trader}
                            bankName={bankName}
                            dest={dest}
                            getCurrencySymbol={getCurrencySymbol}
                            t={t}
                            ns={ns}
                            activeAccordion={activeAccordion}
                            setActiveAccordion={setActiveAccordion}
                        />

                        <PayeeData
                            requisite={requisite ?? ""}
                            trader={trader}
                            bankName={bankName}
                            isPhone={!!trader?.phone || !!trader?.phone_number}
                            caseName={caseName}
                            countryName={[tjs, azn, abh].includes(caseName) ? caseName : ""}
                            transgran={transgran}
                        />
                    </div>

                    <Footer
                        buttonCaption={t("approveTransfer", ns)}
                        buttonCallback={() => {
                            setButtonCallbackEnabled(true);
                        }}
                        nextPage={nextPage}
                        nextEnabled={!isFetching_ButtonCallback}
                        approve={true}
                    />
                </>
            )}
        </div>
    );
};

export default PayPage;
