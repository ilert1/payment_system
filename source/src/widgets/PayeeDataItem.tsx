import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyIcon from "../shared/assets/images/copy.svg?react";
import CheckCircle from "../shared/assets/images/check-circle.svg?react";
import { useAppContext } from "../AppContext";

interface PayeeDataItemProps {
    Img: string | SvgComponent;
    onError?: (e: any) => void;
    label?: string;
    value?: string | undefined;
    cl?: string;
    imgCl?: string;
    copyData?: string;
    messageOnCopy?: string;
    comment?: string;
    labelCode?: string;
}

const PayeeDataItem = (props: PayeeDataItemProps) => {
    const {
        Img = "",
        onError = () => {},
        label = "",
        value = "",
        cl = "",
        imgCl = "",
        copyData = "",
        messageOnCopy = "",
        comment = "",
        labelCode = "" // чтобы в метриках отслеживать название поля минуя локализацию
    } = props;

    const [showPopup, setShowPopup] = useState(false);
    const { ym } = useAppContext();

    let popupTimeout: number | undefined = undefined;

    const showPopupCallback = (value: string) => {
        console.log(`copyed: ${value}`);

        ym("reachGoal", "copy", { labelCode: labelCode, label: label, value: value || "" });
        clearTimeout(popupTimeout);
        setShowPopup(true);

        popupTimeout = setTimeout(() => {
            setShowPopup(false);
        }, 1000);
    };

    return (
        <div className={`payee-data-item ${cl}`}>
            <div className="icon-container">
                {typeof Img === "string" ? <img className={imgCl} src={Img} onError={onError} alt="" /> : <Img />}
            </div>
            <div className="text-container">
                <label>{label}</label>
                <h3 className="value">{value}</h3>
                {comment && <p>{comment}</p>}
            </div>
            {copyData && (
                <>
                    <CopyToClipboard text={copyData} onCopy={() => showPopupCallback(copyData)}>
                        <button id="copy" className="copy">
                            {/* <img src={CopyIcon} alt="" /> */}
                            <CopyIcon />
                        </button>
                    </CopyToClipboard>
                    <div id="copy-popup" className={`popup ${showPopup ? "active" : ""}`}>
                        {messageOnCopy}
                        {/* <img src={CheckCircle} alt="" /> */}
                        <CheckCircle />
                    </div>
                </>
            )}
        </div>
    );
};

export default PayeeDataItem;
