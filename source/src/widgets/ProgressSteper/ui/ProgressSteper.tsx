import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { classNames } from "@/shared/lib/classNames";
import { Timer } from "@/shared/ui/Timer";
import styles from "./ProgressSteper.module.scss";

interface ProgressSteperProps {
    step: number;
}

export const ProgressSteper = ({ step }: ProgressSteperProps) => {
    const [statusText, setStatusText] = useState<string>("");

    const { t } = useTranslation();
    const ns = { ns: "ProgressSteper" };

    useEffect(() => {
        switch (step) {
            case 1:
                setStatusText(t("step1", ns));
                break;

            case 2:
                setStatusText(t("step2", ns));
                break;

            case 3:
                setStatusText(t("step3", ns));
                break;

            default:
                break;
        }
    }, [step]);

    return (
        <div className={styles.progressContainer}>
            <div className={styles.progressSteps}>
                <div className={classNames(styles.step, { [styles.active]: step >= 1 })}>1</div>
                <div className={classNames(styles.step, { [styles.active]: step >= 2 })}>2</div>
                <div className={classNames(styles.step, { [styles.active]: step >= 3 })}>3</div>
            </div>
            <div className={styles.status}>
                <div className={styles.top}>
                    <Timer />
                    <p className={styles.statusText}>{statusText}</p>
                </div>
                <p className={styles.statusComment}>{t("comment", ns)}</p>
            </div>
        </div>
    );
};

export default ProgressSteper;
