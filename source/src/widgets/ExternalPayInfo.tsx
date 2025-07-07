import QRCode from "react-qr-code";
import { useTranslation } from "react-i18next";

interface ExternalPayInfoProps {
    url: string;
}

const ExternalPayInfo = (props: ExternalPayInfoProps) => {
    const { url } = props;
    const { t } = useTranslation();

    const ns = { ns: ["Pay"] };

    return (
        <div className="external-pay-info">
            <p className="external-pay-info__description">{t("scanQrCode", ns)}</p>

            <div>
                <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={url}
                    fgColor="#37a8f3"
                    viewBox={`0 0 256 256`}
                />
            </div>

            <a className="external-pay-info__link" href={url} target="_blank" rel="noopener noreferrer">
                <span>{t("linkToApp", ns)}</span>

                <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M21 3H3.00003V21H21V3ZM16.1317 15.8536L16.1317 7.85356L8.13174 7.85356V9.85356H12.7175L6.47488 16.0962L7.8891 17.5104L14.1317 11.2678V15.8536H16.1317Z"
                        fill="#ffffff"
                    />
                </svg>
            </a>
        </div>
    );
};

export default ExternalPayInfo;
