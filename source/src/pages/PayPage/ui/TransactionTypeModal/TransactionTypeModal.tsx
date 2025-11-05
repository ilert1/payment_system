import { useTranslation } from "react-i18next";
import { useAppContext } from "@/AppContext";
import AlertTriangleBig from "@/shared/assets/images/alert-triangle-big.svg?react";
import { classNames } from "@/shared/lib/classNames";
import { Button } from "@/shared/ui/Button/Button";
import { Heading } from "@/shared/ui/Heading/Heading";
import { Text } from "@/shared/ui/Text/Text";
import { LanguageSelector } from "@/widgets/LanguageSelector";
import { TransactionTypeForm } from "../TransactionTypeForm/TransactionTypeForm";
import styles from "./TransactionTypeModal.module.scss";

interface TransactionTypeModalProps {
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

export const TransactionTypeModal = (props: TransactionTypeModalProps) => {
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
                        <Heading size="l" title={t("transactionTypeForm.title")} align="center" />
                        <Text size="l" text={t("transactionTypeForm.description")} align="center" />
                    </div>
                    <TransactionTypeForm data={data} />
                </div>
            </div>
        </div>
    );
};
