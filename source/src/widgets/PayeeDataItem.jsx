import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyIcon from "../assets/images/copy.svg";
import CheckCircle from "../assets/images/check-circle.svg";

const PayeeDataItem = ({
    img = "",
    onError = () => {},
    label = "",
    value = "",
    cl = "",
    imgCl = "",
    copyData = "",
    messageOnCopy = "",
    comment = ""
}) => {
    const [showPopup, setShowPopup] = useState(false);
    const { ym } = useContext(AppContext);

    let popupTimeout = null;

    const showPopupCallback = () => {
        ym("reachGoal", "copy", { label: label });
        clearTimeout(popupTimeout);
        setShowPopup(true);

        popupTimeout = setTimeout(() => {
            setShowPopup(false);
        }, 1000);
    };
    return (
        <div className={`payee-data-item ${cl}`}>
            <div className="icon-container">
                <img className={imgCl} src={img} onError={onError} alt="" />
            </div>
            <div className="text-container">
                <label>{label}</label>
                <h3 className="value">{value}</h3>
                {comment && <p>{comment}</p>}
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
