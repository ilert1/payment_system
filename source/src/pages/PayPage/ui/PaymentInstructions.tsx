import React from "react";
import { classNames } from "@/shared/lib/classNames";
import { useBFStore } from "@/shared/store/bfDataStore";
import { ExternalPayInfo } from "@/widgets/ExternalPayInfo";
import { Instruction } from "./Instruction/Instruction";
import { InstructionItems } from "./Instruction/InstructionItems";
import styles from "./PaymentInstructions.module.scss";

interface PaymentInstructionsProps {
    caseName: string;
    transgran: boolean;
    trader: any;
    bankName: string;
    dest: "payout" | "payment";
    getCurrencySymbol: (currency: string) => string;
    t: any;
    ns: any;
    /* activeAccordion: number | null;
    setActiveAccordion: (i: number | null) => void; */
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
    ns
    /* activeAccordion,
    setActiveAccordion */
}) => {
    const BFData = useBFStore(state => state.BFData);
    const isConfirmTypeFile = BFData?.[dest]?.method?.context?.confirm_type === "file";
    // External pay info case
    if (BFData?.[dest]?.method?.payee?.redirect_url && BFData?.[dest]?.method?.name === "phone_number") {
        return <ExternalPayInfo url={BFData?.[dest]?.method?.payee?.redirect_url} />;
    }

    // Transgran tsbp cases for tjs/azn
    if ([tjs, azn].includes(caseName) && BFData?.[dest]?.method?.name === "tsbp" /* transgran */) {
        return (
            <div className={classNames(styles.instructionsNew, {}, [styles.transgran])}>
                <div className="title">
                    <p>{t("steps_transgran_simple.tbankTitle", ns)}</p>
                </div>
                <InstructionItems
                    data={t("steps_transgran_simple.steps", {
                        country: t(`steps_transgran_new.country.${caseName}`, ns),
                        code: caseName === tjs ? "+992" : "+994",
                        ...ns
                    })}
                />
            </div>
        );
    }

    console.log("caseName", caseName);
    console.log("BFData?.[dest]?.method?.name", BFData?.[dest]?.method?.name);

    if (isConfirmTypeFile) {
        console.log(bankName);

        return (
            <div className={classNames(styles.instructionsNew, {}, [styles.transgran])}>
                {/* <div className="title">
                    <p>{t("steps_transgran_tcard2card.tbankTitle", ns)}</p>
                </div> */}

                <InstructionItems
                    data={t("steps_with_check.steps", {
                        requisite: t(
                            `steps_with_check.${trader?.phone || trader?.phone_number ? "phoneNumber" : "cardNumber"}`,
                            ns
                        ),
                        bankName: bankName,
                        amount: `${BFData?.[dest]?.amount} ${getCurrencySymbol(BFData?.[dest]?.currency ?? "")}`,
                        buttonName: t("approveTransfer", ns),
                        ...ns
                    })}
                />
            </div>
        );
    }

    /* трансгран кейс для Таджикистана по tcard2card */

    if (caseName === tjs && BFData?.[dest]?.method?.name === "tcard2card") {
        return (
            <div className={classNames(styles.instructionsNew, {}, [styles.transgran])}>
                <div className="title">
                    <p>{t("steps_transgran_tcard2card.tbankTitle", ns)}</p>
                </div>

                <InstructionItems data={t("steps_transgran_tcard2card.tbank", ns)} />
            </div>
        );
    }

    // Transgran for Abkhazia
    if ([abh].includes(caseName) && transgran) {
        return (
            <div className={classNames(styles.instructionsNew, {}, [styles.transgran])}>
                <InstructionItems
                    data={t("steps_transgran_abh.steps", {
                        country: t(`steps_transgran_new.country.${caseName}`, ns),
                        amount: `${BFData?.[dest]?.amount}\u00A0${getCurrencySymbol(BFData?.[dest]?.currency ?? "")}`,
                        ...ns
                    })}
                />
            </div>
        );
    }

    // IBAN case
    if (caseName === iban) {
        return (
            <div className={classNames(styles.instructionsNew, {}, [styles.transgran])}>
                <InstructionItems data={t("steps_iban.iban", ns)} start={0} />
            </div>
        );
    }

    // Default case
    return (
        <div className="instructions_new">
            <InstructionItems
                data={t(`default_steps.${trader?.phone || trader?.phone_number ? "steps_phone" : "steps_card"}`, {
                    amount: `${BFData?.[dest]?.amount}\u00A0${getCurrencySymbol(BFData?.[dest]?.currency ?? "")}`,
                    bankName: bankName,
                    buttonName: t("approveTransfer", ns),
                    ...ns
                })}
            />
        </div>
    );
};
