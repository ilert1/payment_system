import { useTranslation } from "react-i18next";
import { useAppContext } from "@/AppContext";
import PlusCircle from "@/shared/assets/images/plus-circle.svg";
import { useBFStore } from "@/shared/store/bfDataStore";
import { DeadLineTimer } from "@/shared/ui/DeadlineTimer/DeadLineTimer";
import { Text } from "@/shared/ui/Text/Heading";
import { ContentDescription } from "@/widgets/Content";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";
import styles from "./PayErrorPage.module.scss";

export const PayErrorPage = ({ notFound = false }) => {
    const { ym } = useAppContext();

    const { t } = useTranslation();
    const BFData = useBFStore(state => state.BFData);

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const failUrl = BFData?.[dest]?.method?.context?.error_redirect_url ?? "";

    ym("reachGoal", notFound ? "payment-not-found" : "pay-error-page");

    const buttonCallback = () => {
        ym("reachGoal", "fail-return-button", { fail_url: failUrl });
        if (failUrl) window.location.replace(failUrl);
    };

    const ns = { ns: "PayError" };

    return (
        <Page>
            <div className="content">
                <div className="header-container grow">
                    {!notFound ? (
                        <Text title={t("payError", ns)} size="l" />
                    ) : (
                        <Text title={t("notFound", ns)} size="l" />
                    )}
                </div>
                <ContentDescription
                    text={!notFound ? t("pleaseRepeatOrder", ns) : t("pleaseRepeatOrSupport", ns)}
                    lowMb
                    lowMt
                />
                <img className={styles.errorImage} src={PlusCircle} alt="" />

                {failUrl && (
                    <>
                        <p>{t("timerText", ns)}</p>
                        <DeadLineTimer timerSecondsTo={5} timerCallback={() => window.location.replace(failUrl)} />
                    </>
                )}
            </div>

            <Footer
                buttonCaption={t("returnBtn", ns)}
                buttonCallback={buttonCallback}
                nextPage={failUrl}
                nextEnabled={!!failUrl}
                noIcon={true}
                showCancelBtn={false}
            />
        </Page>
    );
};
