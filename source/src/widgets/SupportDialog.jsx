import { useContext, useState } from "react";
import AppContext from "../AppContext";

import AlertTriangleBig from "../assets/images/alert-triangle-big.svg";
import CheckCircle from "../assets/images/check-circle.svg";

import { CopyToClipboard } from "react-copy-to-clipboard";
import ym from "react-yandex-metrika";

const SupportDialog = () => {
    const { BFData, t } = useContext(AppContext);
    const { isActive, setIsActive } = useContext(AppContext).supportDialog;
    const [showPopup, setShowPopup] = useState(false);

    //translation
    const ns = { ns: "SupportDialog" };

    let popupTimeout = null;

    const showPopupCallback = () => {
        if (import.meta.env.VITE_YMETRICS_COUNTER) {
            ym("reachGoal", "copy-dialog-button", { trn: BFData?.trn });
        }
        clearTimeout(popupTimeout);
        setShowPopup(true);

        popupTimeout = setTimeout(() => {
            setShowPopup(false);
        }, 1000);
    };

    return (
        <div
            id="support-dialog"
            className={`overlay ${isActive ? "active" : ""}`}
            onClick={() => {
                setIsActive(false);
            }}>
            <div
                className="dialog"
                onClick={e => {
                    e.stopPropagation();
                }}>
                <img src={AlertTriangleBig} alt="" />
                <div className="uuid-container">
                    <div id="copy-dialog-popup" className={`popup ${showPopup ? "active" : ""}`}>
                        {t("copyed", ns)}
                        <img src={CheckCircle} alt="" />
                    </div>
                    <p id="uuid">{BFData?.trn}</p>
                    <CopyToClipboard text={BFData?.trn} onCopy={showPopupCallback}>
                        <button id="copy-dialog-button">{t("copy", ns)}</button>
                    </CopyToClipboard>
                </div>
                <div className="description">
                    <p className="dialog-header">{t("header", ns)}</p>
                    <p className="dialog-text">{t("text", ns)}</p>
                </div>
                <button
                    className="dialog-button"
                    onClick={() => {
                        if (import.meta.env.VITE_YMETRICS_COUNTER) {
                            ym("reachGoal", "dialog-button", { trn: BFData?.trn });
                        }
                        open("https://t.me/MoneygateSupportBot", "_blank").focus();
                    }}>
                    {t("chatButton", ns)}
                </button>
            </div>
        </div>
    );
};

export default SupportDialog;
