import { useContext, useState } from "react";
import AppContext from "../AppContext";

import AlertTriangleBig from "../shared/assets/images/alert-triangle-big.svg?react";
import CheckCircle from "../shared/assets/images/check-circle.svg?react";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";

const SupportDialog = () => {
    const { BFData, ym } = useContext(AppContext);
    const { t } = useTranslation();
    const { isActive, setIsActive } = useContext(AppContext).supportDialog;
    const [showPopup, setShowPopup] = useState(false);

    //translation
    const ns = { ns: "SupportDialog" };

    let popupTimeout: number | null = null;

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const showPopupCallback = () => {
        if (import.meta.env.VITE_YMETRICS_COUNTER) {
            ym("reachGoal", "copy-dialog-button", { id: BFData?.[dest]?.id });
        }
        if (popupTimeout) clearTimeout(popupTimeout);
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
                {/* <img src={AlertTriangleBig} alt="" /> */}
                <AlertTriangleBig />
                <div className="uuid-container">
                    <div id="copy-dialog-popup" className={`popup ${showPopup ? "active" : ""}`}>
                        {t("copyed", ns)}
                        {/* <img src={CheckCircle} alt="" /> */}
                        <CheckCircle />
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
                {import.meta.env.VITE_SUPPORT_LINK && (
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
                )}
            </div>
        </div>
    );
};

export default SupportDialog;
