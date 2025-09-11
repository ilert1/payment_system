import { useTranslation } from "react-i18next";
import { useAppContext } from "@/AppContext";
import PlusCircle from "@/shared/assets/images/plus-circle.svg";
import { useBFStore } from "@/shared/store/bfDataStore";
import { DeadLineTimer } from "@/shared/ui/DeadlineTimer/DeadLineTimer";
import { Heading } from "@/shared/ui/Heading/Heading";
import { ContentDescription } from "@/widgets/Content";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";
import styles from "./GeneralErrorPage.module.scss";

interface GeneralErrorPageProps {
    cancel?: boolean;
}

export const GeneralErrorPage = (props: GeneralErrorPageProps) => {
    const { cancel } = props;
    const { ym } = useAppContext();
    const BFData = useBFStore(state => state.BFData);

    const { t } = useTranslation();
    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const failUrl = BFData?.[dest]?.method?.context?.error_redirect_url ?? "";
    const cancelUrl = BFData?.[dest]?.method?.context?.cancel_redirect_url ?? "";

    const ns = { ns: ["Common", "GeneralError"] };

    const returnCallback = () => {
        ym("reachGoal", "fail-return-button", { cancel_url: cancelUrl, fail_url: failUrl });
        window.location.replace(cancel && cancelUrl ? cancelUrl : failUrl);
    };

    ym("reachGoal", cancel ? "cancel-page" : "general-error-page");

    return (
        <Page>
            <div className="content">
                <div className="header-container grow">
                    <Heading size="l" title={t(cancel ? "cancelPage.cancel" : "error", ns)} />
                </div>
                <ContentDescription
                    text={t(cancel ? "cancelPage.transactionCanceled" : "pleaseRepeatOrder", ns)}
                    lowMb
                    lowMt
                />

                <img className={styles.errorImage} src={PlusCircle} alt="" />

                {(failUrl || (cancelUrl && cancel)) && (
                    <>
                        <p>{t("timerText", ns)}</p>
                        <DeadLineTimer
                            timerSecondsTo={5}
                            timerCallback={() => window.location.replace(cancel && cancelUrl ? cancelUrl : failUrl)}
                        />
                    </>
                )}
            </div>

            <Footer
                buttonCaption={t("returnBtn", ns)}
                buttonCallback={returnCallback}
                nextPage={cancel && cancelUrl ? cancelUrl : failUrl}
                nextEnabled={cancel && cancelUrl ? Boolean(cancelUrl) : Boolean(failUrl)}
                noIcon={true}
                showCancelBtn={false}
            />
        </Page>
    );
};
