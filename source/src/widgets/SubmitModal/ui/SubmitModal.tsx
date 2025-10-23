/* eslint-disable react/prop-types */
import { useAppContext } from "@/AppContext";
import AlertTriangleBig from "@/shared/assets/images/alert-triangle-big.svg?react";
import { classNames } from "@/shared/lib/classNames";
import { Button } from "@/shared/ui/Button/Button";
import { Heading } from "@/shared/ui/Heading/Heading";
import { Text } from "@/shared/ui/Text/Text";
import { LanguageSelector } from "@/widgets/LanguageSelector";
import styles from "./SubmitModal.module.scss";

interface SubmitModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
    data: {
        title: string;
        text: string;
        primaryBtnText?: string;
        primaryBtnCallback?: () => void;
        secondaryBtnText?: string;
        secondaryBtnCallback?: () => void;
        isCancel?: boolean;
        closeCallback?: () => void;
    };
    isLoading: boolean;
    isUniqueness?: boolean;
}

export const SubmitModal = (props: SubmitModalProps) => {
    const { show, data, isLoading, isUniqueness = false } = props;
    const { lang, setLang } = useAppContext();

    return (
        <div
            className={classNames(styles.overlay, { [styles.overlayActive]: show })}
            onClick={data.closeCallback ? data.closeCallback : () => {}}>
            <div
                onClick={e => {
                    e.stopPropagation();
                }}
                className={classNames(styles.dialog, { [styles.uniqeness]: isUniqueness })}>
                <div className={styles.payoutDialog}>
                    <div className={styles.payoutDialogBlock}>
                        <LanguageSelector lang={lang} setLang={setLang} />
                        <AlertTriangleBig className={styles.alertTriangle} />
                        <Heading size="l" title={data.title} />
                        <Text align="justify" className={styles.text} text={data.text} />
                    </div>

                    <div className={styles.buttonsBlock}>
                        <div className={styles.buttonsSubmit}>
                            {data?.primaryBtnText && (
                                <Button
                                    onClick={data.primaryBtnCallback}
                                    variant={data.isCancel ? "danger" : "default"}
                                    loading={isLoading}
                                    size={"lg"}
                                    className={data.isCancel ? styles.cancelButton : styles.button}>
                                    {data.primaryBtnText}&nbsp;
                                </Button>
                            )}
                            {data?.secondaryBtnText && (
                                <Button
                                    size={"lg"}
                                    variant={"outline"}
                                    onClick={data.secondaryBtnCallback}
                                    disabled={isLoading}
                                    className={styles.button}>
                                    {data.secondaryBtnText}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
