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

const azn = "azn";
const tjs = "tjs";
const iban = "iban";

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

const Instruction = ({ title, data, start = 2, i, active = null, setActive = () => {} }) => {
    const callback = () => {
        if (active == i) setActive(null);
        else setActive(i);
    };
    return (
        <div className={`accordion-container ${active == i ? "active" : ""}`}>
            <div className="title">
                <p onClick={callback}>{title}</p>
                <button onClick={callback}>
                    <img className="arrow" src={ArrowDown} alt="" />
                </button>
            </div>
            <InstructionItems start={start} data={data} />
        </div>
    );
};

const PayPage = () => {
    const { BFData, fingerprintConfig, t, getCurrencySymbol } = useContext(AppContext);

    //translation
    const ns = { ns: ["Common", "Pay"] };

    usePaymentPage({ absolutePath: false });

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";
    const baseApiURL = import.meta.env.VITE_API_URL;

    const method = BFData?.[dest]?.method;
    const trader = method?.payee?.data;

    const [requisite, setRequisite] = useState(null);

    const [activeAccordion, setActiveAccordion] = useState(null);
    const [bankName, setBankName] = useState("");

    const [caseName, setCaseName] = useState("");

    const buttonCallback = async () => {
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
    };

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
        if (trader?.iban) {
            setRequisite(trader.iban);
        }
        console.log(trader);
    }, [trader]);

    useEffect(() => {
        setBankName(
            method?.bank?.display_name ? method?.bank?.display_name : method?.bank?.name /* getBankName(trader?.bank) */
        );
    }, [method?.bank?.name, trader?.bank]);

    useEffect(() => {
        setCaseName("");
        if (BFData?.[dest]?.currency?.toLowerCase() == azn && (trader?.phone || trader?.phone_number)) {
            setCaseName(azn);
        }

        console.log(`trader.bank: ${trader?.bank}`);
        console.log(`bankName: ${bankName}`);
        if (
            ["tawhidbank", "eskhata", "spitamenbank", "dushanbe", "amonatbonk", "arvand", "vasl"].includes(trader?.bank)
        ) {
            setCaseName(tjs);
        }

        if (trader?.iban) {
            setCaseName(iban);
        }
    }, [BFData?.[dest]?.currency, bankName, trader]);

    return (
        <div className="container">
            <Header />
            <div className="content">
                <PayHeader
                    amount={BFData?.[dest]?.amount}
                    currency={getCurrencySymbol(BFData?.[dest]?.currency)}
                    bankName={method?.bank?.display_name}
                    countryName={["tjs" /* , "azn" */].includes(caseName) ? caseName : ""}
                />

                {BFData?.[dest]?.method?.payee?.redirect_url &&
                BFData?.[dest]?.method?.name &&
                BFData?.[dest]?.method?.name === "phone_number" ? (
                    <ExternalPayInfo url={BFData?.[dest]?.method?.payee?.redirect_url} />
                ) : (
                    <>
                        {caseName == tjs && (
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

                                <Instruction
                                    title={t("steps_transgran.tbankTitle", ns)}
                                    data={t("steps_transgran.tbank", ns)}
                                    start={2}
                                    i={1}
                                    active={activeAccordion}
                                    setActive={setActiveAccordion}
                                />
                                <Instruction
                                    title={t("steps_transgran.sberbankTitle", ns)}
                                    data={t("steps_transgran.sberbank", ns)}
                                    start={2}
                                    i={2}
                                    active={activeAccordion}
                                    setActive={setActiveAccordion}
                                />
                            </div>
                        )}

                        {/* {(caseName == azn) && (
                    <>
                        <div className="instructions_new transgran">
                            <InstructionItems data={t("steps_azn.sberbank", ns)} start={0} />
                        </div>
                    </>
                )} */}

                        {caseName == iban && (
                            <>
                                <div className="instructions_new transgran">
                                    <InstructionItems data={t("steps_iban.iban", ns)} start={0} />
                                </div>
                            </>
                        )}

                        {(!caseName || caseName == azn || (caseName && !transgran && caseName !== iban)) && (
                            <div className="instructions_new">
                                <ul>
                                    <li>
                                        <span>1. </span>
                                        {t(`steps_new.one${trader?.phone ? "Phone" : ""}`, ns)}
                                    </li>
                                    <li>
                                        <span>2. </span>
                                        {t(`steps_new.two${trader?.phone ? "Phone" : ""}`, ns)} <span>{bankName}</span>{" "}
                                        {t("steps_new.onAmount", ns)}{" "}
                                        <span>
                                            {BFData?.[dest]?.amount}&nbsp;
                                            {getCurrencySymbol(BFData?.[dest]?.currency)}
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
                        )}
                    </>
                )}

                <PayeeData
                    requisite={requisite}
                    trader={trader}
                    bankName={method?.bank?.display_name}
                    isPhone={!!trader?.phone || !!trader?.phone_number}
                    caseName={caseName}
                />
            </div>

            <Footer
                buttonCaption={t("approveTransfer", ns)}
                buttonCallback={buttonCallback}
                nextPage={`../${c.PAGE_PAYEE_DATA}`}
                approve={true}
            />
        </div>
    );
};

export default PayPage;
