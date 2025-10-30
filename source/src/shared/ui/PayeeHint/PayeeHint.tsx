import { useTranslation } from "react-i18next";
import { classNames } from "@/shared/lib/classNames";
import styles from "./PayeeHint.module.scss";

export const PayeeHint = ({ showPopup, payeeData }: { showPopup: boolean; payeeData: string }) => {
    const { t } = useTranslation();
    //translation
    const ns = { ns: "PayeeHint" };

    return (
        <div id="payee-hint" className={classNames(styles.hint, { [styles.active]: showPopup })}>
            {payeeData}
            <br></br>
            <br></br>
            {t("hint.part1", ns)}
            <br></br>
            <br></br>
            {t("hint.part2", ns)}
        </div>
    );
};

export default PayeeHint;
