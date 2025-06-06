import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";

import axios from "axios";
import usePaymentPage from "../hooks/usePaymentPage.jsx";
import PayHeader from "../widgets/PayHeader.jsx";
import PayeeData from "../widgets/PayeeData.jsx";
import ExternalPayInfo from "../widgets/ExternalPayInfo.jsx";
import { getLocalBankName } from "../Localization.jsx";
import Loader from "../ui/Loader.jsx";
import { useQuery } from "@tanstack/react-query";
import ArrowDown from "../assets/images/chevron-down.svg";

const azn = "azn";
const tjs = "tjs";
const iban = "iban";
const abh = "abh";

const DefaultInstructionItems = ({ trader, bankName, amount, t, currency, first_step = true, start = 0 }) => {
    //translation
    const ns = { ns: ["Common", "Pay"] };
    const startFrom = first_step ? 1 : 0;

    return (
        <ul>
            {first_step && (
                <li>
                    <span>{start + startFrom}. </span>
                    {t(`steps_new.one${trader?.phone || trader?.phone_number ? "Phone" : ""}`, ns)}
                </li>
            )}
            <li>
                <span>{start + startFrom + 1}. </span>
                {t(`steps_new.two${!!trader?.phone || trader?.phone_number ? "Phone" : ""}`, ns)}{" "}
                <span>{bankName}</span> {t("steps_new.onAmount", ns)}{" "}
                <span>
                    {amount}&nbsp;
                    {currency}
                </span>
            </li>
            <li>
                <span>{start + startFrom + 2}. </span>
                {t("steps_new.pressButton", ns)}
                <span>
                    {' "'}
                    {t("steps_new.payed", ns)}
                    {'"'}
                </span>
            </li>
        </ul>
    );
};

const InstructionItems = ({ start = 0, data = "" }) => {
    return (
        <ul>
            {data.split("|").map((item, index) => (
                <li key={index}>
                    <span>{start + index + 1}. </span>
                    {item}
                </li>
            ))}
        </ul>
    );
};

const Instruction = ({ title, data, start = 2, i, active = null, setActive = () => {}, children }) => {
    const { ym } = useContext(AppContext);
    const callback = () => {
        if (active == i) setActive(null);
        else setActive(i);
        ym("reachGoal", "instruction-button", { title: title });
    };
    return (
        <div className={`accordion-container ${active == i ? "active" : ""}`}>
            <div className="title">
                <p onClick={callback}>{title}</p>
                <button onClick={callback}>
                    <img className="arrow" src={ArrowDown} alt="" />
                </button>
            </div>
            {children ? children : <InstructionItems start={start} data={data} />}
        </div>
    );
};

const PayPage = () => {
    const { BFData, fingerprintConfig, t, getCurrencySymbol, setBFData, caseName, setCaseName, lang } =
        useContext(AppContext);

    //translation
    const ns = { ns: ["Common", "Pay"] };

    usePaymentPage({ absolutePath: false });

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const baseApiURL = import.meta.env.VITE_API_URL;

    const method = BFData?.[dest]?.method;
    const trader = method?.payee?.data;
    const [needRefreshBFData, setNeedRefreshBFData] = useState(false);

    const transgran = ["tsbp", "tcard2card"].includes(method?.name);

    const [requisite, setRequisite] = useState(null);

    const [activeAccordion, setActiveAccordion] = useState(null);
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

        //AZN case check
        if (
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
            ].includes(trader?.bank_name)
        ) {
            setCaseName(azn);
            console.log(`caseName: azn`);
        }

        //TJS case check
        if (
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
            ].includes(trader?.bank_name)
        ) {
            setCaseName(tjs);
            console.log(`caseName: tjs`);
        }

        //ABH case check
        if (["a-mobile"].includes(trader?.bank_name)) {
            setCaseName(abh);
            console.log(`caseName: abh`);
        }

        if (trader?.iban_number) {
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
                console.log(data);

                if (data) {
                    if (data?.success) {
                        //данные получены успешно
                        console.log("setBFData");
                        console.log(data);

                        setBFData(data);
                    } else {
                        //транзакция не найдена или не подлежит оплате
                        console.log(data?.error);
                        setNeedRefreshBFData(false);
                        window.location.replace(`/${payOutMode ? c.PAGE_PAYOUT_NOT_FOUND : c.PAGE_PAYMENT_NOT_FOUND}`);
                    }
                }
                return data;
            } catch (e) {
                console.error(e.response.statusCode);
                if (e.response.statusCode === 404) {
                    window.location.replace(`/${payOutMode ? c.PAGE_PAYOUT_NOT_FOUND : c.PAGE_PAYMENT_NOT_FOUND}`);
                }
            } finally {
                setNeedRefreshBFData(false);
            }
        }
    });

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
                            amount={BFData?.[dest]?.amount}
                            currency={getCurrencySymbol(BFData?.[dest]?.currency)}
                            bankName={bankName}
                            countryName={[tjs, azn, abh].includes(caseName) ? caseName : ""}
                            transgran={transgran}
                            timestamp={BFData?.[dest]?.created_at}
                        />

                        {BFData?.[dest]?.method?.payee?.redirect_url &&
                        BFData?.[dest]?.method?.name &&
                        BFData?.[dest]?.method?.name === "phone_number" ? (
                            <ExternalPayInfo url={BFData?.[dest]?.method?.payee?.redirect_url} />
                        ) : (
                            <>
                                {/* трансгран кейс для Таджикистана и Азербайджана */}
                                {[tjs, azn, abh].includes(caseName) && transgran && (
                                    <div className="instructions_new transgran">
                                        <ul>
                                            <li>
                                                <span>1. </span>
                                                {t("steps_transgran.one", ns)}
                                            </li>
                                            <li>
                                                <span>2. </span>
                                                {t("steps_transgran.two", ns)}
                                            </li>
                                        </ul>
                                        {[tjs, azn].includes(caseName) && (
                                            <Instruction
                                                title={t("steps_transgran.tbankTitle", ns)}
                                                data={t("steps_transgran.tbank", ns)}
                                                start={2}
                                                i={1}
                                                active={activeAccordion}
                                                setActive={setActiveAccordion}
                                            />
                                        )}
                                        <Instruction
                                            title={t("steps_transgran.sberbankTitle", ns)}
                                            data={t("steps_transgran.sberbank", ns)}
                                            start={2}
                                            i={2}
                                            active={activeAccordion}
                                            setActive={setActiveAccordion}
                                        />
                                        {[tjs, azn].includes(caseName) && (
                                            <Instruction
                                                title={t("steps_transgran.vtbbankTitle", ns)}
                                                data={t("steps_transgran.vtbbank", ns)}
                                                start={2}
                                                i={3}
                                                active={activeAccordion}
                                                setActive={setActiveAccordion}
                                            />
                                        )}
                                        <Instruction
                                            title={`${t(`steps_transgran_new.title.local`, ns)}${
                                                [tjs, azn, abh].includes(caseName)
                                                    ? ` (${t(`steps_transgran_new.country.${caseName}`, ns)})`
                                                    : ""
                                            }`}
                                            i={4}
                                            active={activeAccordion}
                                            setActive={setActiveAccordion}
                                            isDefault={true}>
                                            <DefaultInstructionItems
                                                trader={trader}
                                                bankName={bankName}
                                                amount={BFData?.[dest]?.amount}
                                                t={t}
                                                currency={getCurrencySymbol(BFData?.[dest]?.currency)}
                                                first_step={false}
                                                start={2}
                                            />
                                        </Instruction>
                                    </div>
                                )}

                                {/*  кейс для iban  */}
                                {caseName == iban && (
                                    <>
                                        <div className="instructions_new transgran">
                                            <InstructionItems data={t("steps_iban.iban", ns)} start={0} />
                                        </div>
                                    </>
                                )}

                                {/*  стандартная инструкция, если не выполнены другие условия */}
                                {(!caseName || (caseName && !transgran && caseName !== iban)) && (
                                    <div className="instructions_new">
                                        <DefaultInstructionItems
                                            trader={trader}
                                            bankName={bankName}
                                            amount={BFData?.[dest]?.amount}
                                            t={t}
                                            currency={getCurrencySymbol(BFData?.[dest]?.currency)}
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        <PayeeData
                            requisite={requisite}
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
                        nextPage={`../${c.PAGE_PAYEE_DATA}`}
                        nextEnabled={!isFetching_ButtonCallback}
                        approve={true}
                    />
                </>
            )}
        </div>
    );
};

export default PayPage;
