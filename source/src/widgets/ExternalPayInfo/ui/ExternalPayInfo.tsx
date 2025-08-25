import QRCode from "react-qr-code";
import { useTranslation } from "react-i18next";
import LinkToAppIcon from "@/shared/assets/images/link-to-app-icon.svg?react";
import styles from "./ExternalPayInfo.module.scss";
interface ExternalPayInfoProps {
    url: string;
}

export const ExternalPayInfo = (props: ExternalPayInfoProps) => {
    const { url } = props;
    const { t } = useTranslation();

    const ns = { ns: ["Pay"] };

    return (
        <div className={styles.externalPayInfo}>
            <p className={styles.description}>{t("scanQrCode", ns)}</p>

            <div>
                <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={url}
                    fgColor="#37a8f3"
                    viewBox={`0 0 256 256`}
                />
            </div>

            <a className={styles.link} href={url} target="_blank" rel="noopener noreferrer">
                <span>{t("linkToApp", ns)}</span>
                <LinkToAppIcon />
            </a>
        </div>
    );
};
