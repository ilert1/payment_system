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

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const showPopupCallback = () => {
        if (import.meta.env.VITE_YMETRICS_COUNTER) {
            ym("reachGoal", "copy-dialog-button", { id: BFData?.[dest]?.id });
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
                    <p id="uuid">{BFData?.[dest]?.id}</p>
                    <CopyToClipboard text={BFData?.[dest]?.id} onCopy={showPopupCallback}>
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
                            ym("reachGoal", "dialog-button", { id: BFData?.[dest]?.id });
                        }
                        open(import.meta.env.VITE_SUPPORT_LINK, "_blank").focus();
                    }}>
                    {t("chatButton", ns)}
                </button>
            </div>
        </div>
    );
};

export default SupportDialog;
