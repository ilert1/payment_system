import { useTranslation } from "react-i18next";
import styles from "./DefaultInstructionItems.module.scss";

interface DefaultInstructionItemsProps {
    trader: Trader;
    bankName: string;
    amount: string;
    currency: string;
    first_step?: boolean;
    start?: number;
}

export const DefaultInstructionItems = (props: DefaultInstructionItemsProps) => {
    const { trader, bankName, amount, currency, first_step = true, start = 0 } = props;
    const { t } = useTranslation();

    //translation
    const ns = { ns: ["Common", "Pay"] };
    const startFrom = first_step ? 1 : 0;

    return (
        <ul className={styles.ul}>
            {first_step && (
                <li className={styles.liAndSpan}>
                    <span>{start + startFrom}. </span>
                    {t(`steps_new.one${trader?.phone || trader?.phone_number ? "Phone" : ""}`, ns)}
                </li>
            )}
            <li className={styles.liAndSpan}>
                <span>{start + startFrom + 1}. </span>
                {t(`steps_new.two${!!trader?.phone || trader?.phone_number ? "Phone" : ""}`, ns)}{" "}
                <span>{bankName}</span> {t("steps_new.onAmount", ns)}{" "}
                <span>
                    {amount}&nbsp;
                    {currency}
                </span>
            </li>
            <li className={styles.liAndSpan}>
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
