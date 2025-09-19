import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useAppContext } from "@/AppContext";
import CheckCircle from "@/shared/assets/images/check-circle.svg?react";
import CopyIcon from "@/shared/assets/images/copy.svg?react";
import { classNames } from "@/shared/lib/classNames";
import { Button } from "@/shared/ui/Button/Button";
import { Heading } from "@/shared/ui/Heading/Heading";
import { Label } from "@/shared/ui/Label";
import { Text } from "@/shared/ui/Text/Text";
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
                {typeof Img === "string" ? (
                    <img
                        className={classNames(styles.img, {}, [imgCl])}
                        src={Img}
                        onError={onError}
                        alt=""
                        data-testid="PayeeDataItem.img"
                    />
                ) : (
                    <Img className={classNames(styles.img, {}, [imgCl])} />
                )}
            </div>
            <div className={styles.textContainer}>
                <Label size="sm" text={label} />
                <Heading size="m" title={value} />
                {comment && <Text text={comment} size="xxs" />}
            </div>
            {copyData && (
                <>
                    <CopyToClipboard text={copyData} onCopy={() => showPopupCallback(copyData)}>
                        <Button className={styles.copy} variant={"ghost"} data-testid="PayeeDataItem">
                            <CopyIcon className={styles.img} />
                        </Button>
                    </CopyToClipboard>
                    <div
                        className={classNames(styles.popup, { [styles.active]: showPopup })}
                        data-testid="PayeeDataItem.popup">
                        <Text size="2xs" text={messageOnCopy} />
                        <CheckCircle />
                    </div>
                </>
            )}
        </div>
    );
};
