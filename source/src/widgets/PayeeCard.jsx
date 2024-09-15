import { useState } from "react";
import { useContext } from "react";
import AppContext from "../AppContext";

import CheckCircle from "../assets/images/check-circle.svg";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const PayeeCard = ({ payeeCardNumber, isPhone }) => {
    const [showPopup, setShowPopup] = useState(false);

    const { t } = useContext(AppContext);
    //translation
    const ns = { ns: "PayeeCard" };

    let popupTimeout = null;

    const showPopupCallback = () => {
        clearTimeout(popupTimeout);
        setShowPopup(true);

        popupTimeout = setTimeout(() => {
            setShowPopup(false);
        }, 1000);
    };

    return (
        <div className="payee-card-number-container">
            <p className="payee-card-number">{payeeCardNumber}</p>
            <CopyToClipboard text={payeeCardNumber} onCopy={showPopupCallback}>
                <button id="copy" className="copy">
                    {t("copy", ns)}
                </button>
            </CopyToClipboard>
            <div id="copy-popup" className={`popup ${showPopup ? "active" : ""}`}>
                {isPhone ? t("copyedPhone", ns) : t("copyed", ns)}
                <img src={CheckCircle} alt="" />
            </div>
        </div>
    );
};
