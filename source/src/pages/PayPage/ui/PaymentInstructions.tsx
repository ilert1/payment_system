import React from "react";
import { Instruction } from "./Instruction";
import { InstructionItems } from "./InstructionItems";
import { DefaultInstructionItems } from "./DefaultInstructionItems";
import ExternalPayInfo from "@/widgets/ExternalPayInfo";
import { useBFStore } from "@/shared/store/bfDataStore";

interface PaymentInstructionsProps {
    caseName: string;
    transgran: boolean;
    trader: any;
    bankName: string;
    dest: "payout" | "payment";
    getCurrencySymbol: (currency: string) => string;
    t: any;
    ns: any;
    activeAccordion: number | null;
    setActiveAccordion: (i: number | null) => void;
}

const azn = "azn";
const tjs = "tjs";
const iban = "iban";
const abh = "abh";

export const PaymentInstructions: React.FC<PaymentInstructionsProps> = ({
    caseName,
    transgran,
    trader,
    bankName,
    dest,
    getCurrencySymbol,
    t,
    ns,
    activeAccordion,
    setActiveAccordion
}) => {
    const BFData = useBFStore(state => state.BFData);
    // External pay info case
    if (BFData?.[dest]?.method?.payee?.redirect_url && BFData?.[dest]?.method?.name === "phone_number") {
        return <ExternalPayInfo url={BFData?.[dest]?.method?.payee?.redirect_url} />;
    }

    // Transgran tsbp cases for tjs/azn
    if ([tjs, azn].includes(caseName) && BFData?.[dest]?.method?.name === "tsbp" /* transgran */) {
        return (
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
                    data={t("steps_transgran.tbank", {
                        country: t(`steps_transgran_new.country.${caseName}`, ns),
                        ...ns
                    })}
                    start={2}
                    i={1}
                    active={activeAccordion}
                    setActive={setActiveAccordion}
                />
                <Instruction
                    title={t("steps_transgran.sberbankTitle", ns)}
                    data={t("steps_transgran.sberbank", {
                        country: t(`steps_transgran_new.country.${caseName}`, ns),
                        ...ns
                    })}
                    start={2}
                    i={2}
                    active={activeAccordion}
                    setActive={setActiveAccordion}
                />
                <Instruction
                    title={t("steps_transgran.vtbbankTitle", ns)}
                    data={t("steps_transgran.vtbbank", {
                        country: t(`steps_transgran_new.country.${caseName}`, ns),
                        ...ns
                    })}
                    start={2}
                    i={3}
                    active={activeAccordion}
                    setActive={setActiveAccordion}
                />
                {(() => {
                    const localTitle =
                        t("steps_transgran_new.title.local", ns) +
                        ([tjs, azn, abh].includes(caseName)
                            ? ` (${t(`steps_transgran_new.country.${caseName}`, ns)})`
                            : "");
                    return (
                        <Instruction title={localTitle} i={4} active={activeAccordion} setActive={setActiveAccordion}>
                            <DefaultInstructionItems
                                trader={trader}
                                bankName={bankName}
                                amount={BFData?.[dest]?.amount ?? ""}
                                currency={getCurrencySymbol(BFData?.[dest]?.currency ?? "")}
                                first_step={false}
                                start={2}
                            />
                        </Instruction>
                    );
                })()}
            </div>
        );
    }

    console.log("caseName", caseName);
    console.log("BFData?.[dest]?.method?.name", BFData?.[dest]?.method?.name);

    /* трансгран кейс для Таджикистана по tcard2card */

    if (caseName === tjs && BFData?.[dest]?.method?.name === "tcard2card") {
        return (
            <div className="instructions_new transgran">
                <div className="title">
                    <p>{t("steps_transgran_tcard2card.tbankTitle", ns)}</p>
                </div>

                <InstructionItems data={t("steps_transgran_tcard2card.tbank", ns)} start={0} />
            </div>
        );
    }

    // Transgran for Abkhazia
    if ([abh].includes(caseName) && transgran) {
        return (
            <div className="instructions_new transgran">
                <InstructionItems
                    data={t("steps_transgran_abh.steps", {
                        country: t(`steps_transgran_new.country.${caseName}`, ns),
                        amount: `${BFData?.[dest]?.amount}\u00A0${getCurrencySymbol(BFData?.[dest]?.currency ?? "")}`,
                        ...ns
                    })}
                    start={0}
                />
            </div>
        );
    }

    // IBAN case
    if (caseName === iban) {
        return (
            <div className="instructions_new transgran">
                <InstructionItems data={t("steps_iban.iban", ns)} start={0} />
            </div>
        );
    }

    // Default case
    return (
        <div className="instructions_new">
            <DefaultInstructionItems
                trader={trader}
                bankName={bankName}
                amount={BFData?.[dest]?.amount ?? ""}
                currency={getCurrencySymbol(BFData?.[dest]?.currency ?? "")}
            />
        </div>
    );
};
