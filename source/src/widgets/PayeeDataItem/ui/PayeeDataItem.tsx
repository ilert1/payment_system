import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAppContext } from "@/AppContext";
import CheckCircle from "@/shared/assets/images/check-circle.svg?react";
import CopyIcon from "@/shared/assets/images/copy.svg?react";
import { classNames } from "@/shared/lib/classNames";
import { Text } from "@/shared/ui/Text/Heading";
import styles from "./PayeeDataItem.module.scss";

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

export const PayeeDataItem = (props: PayeeDataItemProps) => {
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

    let popupTimeout: NodeJS.Timeout | undefined = undefined;

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
        <div className={classNames(styles.payeeDataItem, {}, [cl])}>
            <div className={styles.iconContainer}>
                {typeof Img === "string" ? <img className={imgCl} src={Img} onError={onError} alt="" /> : <Img />}
            </div>
            <div className={styles.textContainer}>
                <label>{label}</label>
                <Text size="m" title={value} />
                {comment && <p>{comment}</p>}
            </div>
            {copyData && (
                <>
                    <CopyToClipboard text={copyData} onCopy={() => showPopupCallback(copyData)}>
                        <button id="copy" className={styles.copy}>
                            {/* <img src={CopyIcon} alt="" /> */}
                            <CopyIcon />
                        </button>
                    </CopyToClipboard>
                    <div id="copy-popup" className={classNames(styles.popup, { [styles.active]: showPopup })}>
                        {messageOnCopy}
                        {/* <img src={CheckCircle} alt="" /> */}
                        <CheckCircle />
                    </div>
                </>
            )}
        </div>
    );
};
