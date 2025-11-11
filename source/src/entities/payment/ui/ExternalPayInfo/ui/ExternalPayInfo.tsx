import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import LinkToAppIcon from "@/shared/assets/images/link-to-app-icon.svg?react";
import TBankIcon from "@/shared/assets/images/t_bank.svg?react";
import { Button } from "@/shared/ui/Button/Button";
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

// Check for mock OS in URL query parameter for testing
// MOCK FOR TESTING ANDROID AND IOS
// const urlParams = new URLSearchParams(window.location.search);
// const mockOS = urlParams.get("mockOS");

// if (mockOS === "android" || mockOS === "ios" || mockOS === "other") {
//     console.log(`[ExternalPayInfo] Mock OS detected: ${mockOS}`);
//     return mockOS;
// }

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
    const { t } = useTranslation("Pay");

    // Check if this is bank_app_deeplink_cross_border method
    const isBankAppDeeplink = methodName === "bank_app_deeplink_cross_border";

    // Determine the actual URL to use
    let actualUrl = url;
    let showLink = false;

    if (isBankAppDeeplink && paymentMethod) {
        const os = detectOS();

        if (os === "android" && paymentMethod.payee?.deeplink_android) {
            actualUrl = paymentMethod.payee.deeplink_android;
            showLink = true;
        } else if (os === "ios" && paymentMethod.payee?.deeplink_ios) {
            actualUrl = paymentMethod.payee.deeplink_ios;
            showLink = true;
        } else if (os === "other") {
            showLink = false;
        }
    }

    return (
        <div className={styles.externalPayInfo}>
            {!isBankAppDeeplink ? (
                <>
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
                    <a className={styles.link} href={url} target="_blank" rel="noopener noreferrer">
                        <span>{t("linkToApp")}</span>
                        <LinkToAppIcon />
                    </a>
                </>
            ) : (
                <>
                    {showLink ? (
                        <>
                            <Text variant="warning" text={t("payWithOneClick")} />
                            <Button
                                variant="warning"
                                onClick={() => window.open(actualUrl, "_blank")}
                                className={styles.linkToTinkoffButton}>
                                <Text size="l" text={t("payInTBank")} />
                                <TBankIcon />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Text variant="warning" text={t("paymintIsGoingThroughTBank")} />
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
                        </>
                    )}
                </>
            )}
        </div>
    );
};
