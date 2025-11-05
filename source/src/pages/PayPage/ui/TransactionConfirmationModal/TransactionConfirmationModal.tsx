import { useTranslation } from "react-i18next";
import { useAppContext } from "@/AppContext";
import { classNames } from "@/shared/lib/classNames";
import { Heading } from "@/shared/ui/Heading/Heading";
import { Text } from "@/shared/ui/Text/Text";
import { LanguageSelector } from "@/widgets/LanguageSelector";
import { TransactionConfirmationForm } from "../TransactionConfirmationForm/TransactionConfirmationForm.module";
import styles from "./TransactionConfirmationModal.module.scss";

interface TransactionConfirmationModalProps {
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
}

export const TransactionConfirmationModal = (props: TransactionConfirmationModalProps) => {
    const { show, data } = props;
    const { lang, setLang } = useAppContext();
    const { t } = useTranslation("Pay");

    return (
        <div
            className={classNames(styles.overlay, { [styles.overlayActive]: show })}
            onClick={data.closeCallback ? data.closeCallback : () => {}}>
            <div
                onClick={e => {
                    e.stopPropagation();
                }}
                className={styles.dialog}>
                <div className={styles.payoutDialog}>
                    <div className={styles.payoutDialogBlock}>
                        <LanguageSelector lang={lang} setLang={setLang} />
                        <Heading size="l" title={t("transactionConfirmationForm.title")} align="center" />
                        <Text size="l" text={t("transactionConfirmationForm.description")} align="center" />
                    </div>
                    <TransactionConfirmationForm data={data} />
                </div>
            </div>
        </div>
    );
};
