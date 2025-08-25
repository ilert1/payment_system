/* eslint-disable react/prop-types */
import { useAppContext } from "@/AppContext";
import { classNames } from "@/shared/lib/classNames";
import { Button } from "@/shared/ui/Button/Button";
import LanguageSelector from "@/widgets/LanguageSelector";
import AlertTriangleBig from "../shared/assets/images/alert-triangle-big.svg?react";
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
}

export const SubmitModal = (props: SubmitModalProps) => {
    const { show, setShow, data, isLoading } = props;
    const { lang, setLang } = useAppContext();

    return (
        <div
            className={classNames(styles.overlay, { [styles.overlayActive]: show })}
            onClick={data.closeCallback ? data.closeCallback : () => {}}>
            <div
                onClick={e => {
                    e.stopPropagation();
                }}
                className={classNames(styles.dialog)}>
                <div className={styles.payoutDialog}>
                    <div className={styles.payoutDialogBlock}>
                        <LanguageSelector lang={lang} setLang={setLang} />
                        <AlertTriangleBig className="alert-triangle" />
                        <h3 className={styles.title}>{data.title}</h3>
                        <p className={styles.text}>{data.text}</p>
                    </div>

                    <div className={styles.buttonsBlock}>
                        <div className={styles.buttonsSubmit}>
                            {data?.primaryBtnText && (
                                // <button
                                //     onClick={data.primaryBtnCallback}
                                //     className={`button ${data.isCancel ? "cancel-button" : "main-button"} ${
                                //         isLoading ? "cancel-button__loading" : ""
                                //     }`}
                                //     disabled={false}>
                                //     {!isLoading && data.primaryBtnText}&nbsp;
                                // </button>
                                <Button
                                    onClick={data.primaryBtnCallback}
                                    variant={data.isCancel ? "danger" : "default"}
                                    loading={isLoading}>
                                    {data.primaryBtnText}&nbsp
                                </Button>
                            )}
                            {data?.secondaryBtnText && (
                                // <button
                                //     className="button outline-button"
                                //     onClick={data.secondaryBtnCallback}
                                //     disabled={isLoading}>
                                //     {data.secondaryBtnText}
                                // </button>
                                <Button variant={"outline"} onClick={data.secondaryBtnCallback} disabled={isLoading}>
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
