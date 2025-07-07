import { useTranslation } from "react-i18next";

export const PayeeHint = ({ showPopup, payeeData }) => {
    const { t } = useTranslation();
    //translation
    const ns = { ns: "PayeeHint" };

    return (
        <div id="payee-hint" className={`hint ${showPopup ? "active" : ""}`}>
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
