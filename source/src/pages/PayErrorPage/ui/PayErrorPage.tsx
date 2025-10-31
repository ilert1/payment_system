import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppContext } from "@/AppContext";
import { ContentDescription } from "@/entities/payment";
import PlusCircleIcon from "@/shared/assets/images/plus-circle.svg?react";
import { useFooterStore } from "@/shared/store/FooterStore/slice/FooterSlice";
import { useBFStore } from "@/shared/store/bfDataStore";
import { DeadLineTimer } from "@/shared/ui/DeadlineTimer/DeadLineTimer";
import { Text } from "@/shared/ui/Text/Text";
import { Content, HeadingContainer } from "@/widgets/Content";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";
import styles from "./PayErrorPage.module.scss";

export const PayErrorPage = ({ notFound = false }) => {
    const { ym } = useAppContext();
    const setFooter = useFooterStore(state => state.setFooter);
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

    const headingText = notFound ? t("notFound", ns) : t("payError", ns);

    useEffect(() => {
        setFooter({
            buttonCaption: t("returnBtn", ns),
            buttonCallback: buttonCallback,
            nextPage: failUrl,
            nextEnabled: !!failUrl,
            noIcon: true,
            showCancelBtn: false,
            isUnicalization: false,
            approve: false
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Page>
            <Content>
                <HeadingContainer headingText={headingText} grow />
                <ContentDescription
                    text={!notFound ? t("pleaseRepeatOrder", ns) : t("pleaseRepeatOrSupport", ns)}
                    lowMb
                    lowMt
                />
                <PlusCircleIcon className={styles.errorImage} />
                {failUrl && (
                    <>
                        <Text align="center" text={t("timerText", ns)} />
                        <DeadLineTimer
                            timerSecondsTo={5}
                            timerCallback={() => window.location.replace(failUrl)}
                            orange={false}
                        />
                    </>
                )}
            </Content>
            <Footer />
        </Page>
    );
};
