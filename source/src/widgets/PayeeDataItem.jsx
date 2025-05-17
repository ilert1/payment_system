import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyIcon from "../assets/images/copy.svg";
import CheckCircle from "../assets/images/check-circle.svg";
import ym from "react-yandex-metrika";

const PayeeDataItem = ({
    img = "",
    onError = () => {},
    label = "",
    value = "",
    cl = "",
    copyData = "",
    messageOnCopy = "",
    comment = ""
}) => {
    const [showPopup, setShowPopup] = useState(false);

    let popupTimeout = null;

    const showPopupCallback = () => {
        if (import.meta.env.VITE_YMETRICS_COUNTER) {
            ym("reachGoal", "copy", { label: label });
        }
        clearTimeout(popupTimeout);
        setShowPopup(true);

        popupTimeout = setTimeout(() => {
            setShowPopup(false);
        }, 1000);
    };
    return (
        <div className={`payee-data-item ${cl}`}>
            <div className="icon-container">
                <img src={img} onError={onError} alt="" />
            </div>
            <div className="text-container">
                <label>{label}</label>
                <h3 className="value">{value}</h3>
                {comment && <label>{comment}</label>}
            </div>
            {copyData && (
                <>
                    <CopyToClipboard text={copyData} onCopy={showPopupCallback}>
                        <button id="copy" className="copy">
                            <img src={CopyIcon} alt="" />
                        </button>
                    </CopyToClipboard>
                    <div id="copy-popup" className={`popup ${showPopup ? "active" : ""}`}>
                        {messageOnCopy}
                        <img src={CheckCircle} alt="" />
                    </div>
                </>
            )}
        </div>
    );
};

export default PayeeDataItem;
