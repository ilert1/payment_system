import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import LinkToAppIcon from "@/shared/assets/images/link-to-app-icon.svg?react";
import { Text } from "@/shared/ui/Text/Text";
import styles from "./ExternalPayInfo.module.scss";

interface ExternalPayInfoProps {
    url: string;
    methodName?: string;
    paymentMethod?: {
        payee?: {
            deeplink_android?: string;
            deeplink_ios?: string;
            [key: string]: any;
        };
        [key: string]: any;
    };
}

const detectOS = (): "android" | "ios" | "other" => {
    const userAgent = navigator.userAgent || (window as any).opera;

    if (/android/i.test(userAgent)) {
        return "android";
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
        return "ios";
    }

    return "other";
};

export const ExternalPayInfo = (props: ExternalPayInfoProps) => {
    const { url, methodName, paymentMethod } = props;
    const { t } = useTranslation();

    const ns = { ns: ["Pay"] };

    // Check if this is bank_app_deeplink_cross_border method
    const isBankAppDeeplink = methodName === "bank_app_deeplink_cross_border";

    // Determine the actual URL to use
    let actualUrl = url;
    let showLink = true;
    let placeholderText: string | null = null;

    if (isBankAppDeeplink && paymentMethod) {
        const os = detectOS();

        if (os === "android" && paymentMethod.payee?.deeplink_android) {
            actualUrl = paymentMethod.payee.deeplink_android;
        } else if (os === "ios" && paymentMethod.payee?.deeplink_ios) {
            actualUrl = paymentMethod.payee.deeplink_ios;
        } else if (os === "other") {
            // For other systems, show placeholder text instead of link
            showLink = false;
            placeholderText = "Please use a mobile device to complete this payment";
        }
    }

    return (
        <div className={styles.externalPayInfo}>
            <Text text={t("scanQrCode", ns)} />

            <div>
                <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={actualUrl}
                    fgColor="#37a8f3"
                    viewBox={`0 0 256 256`}
                    data-testid="qr-code"
                />
            </div>
            {!isBankAppDeeplink ? (
                <a className={styles.link} href={url} target="_blank" rel="noopener noreferrer">
                    <span>{t("linkToApp", ns)}</span>
                    <LinkToAppIcon />
                </a>
            ) : showLink ? (
                <a className={styles.link} href={actualUrl} target="_blank" rel="noopener noreferrer">
                    <span>{t("linkToApp", ns)}</span>
                    <LinkToAppIcon />
                </a>
            ) : (
                placeholderText && <Text text={placeholderText} />
            )}
        </div>
    );
};
