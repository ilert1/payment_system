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
import styles from "./GeneralErrorPage.module.scss";

interface GeneralErrorPageProps {
    cancel?: boolean;
}

export const GeneralErrorPage = (props: GeneralErrorPageProps) => {
    const { cancel } = props;
    const { ym } = useAppContext();
    const BFData = useBFStore(state => state.BFData);
    const setFooter = useFooterStore(state => state.setFooter);

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

    useEffect(() => {
        setFooter({
            buttonCaption: t("returnBtn", ns),
            buttonCallback: returnCallback,
            nextPage: cancel && cancelUrl ? cancelUrl : failUrl,
            nextEnabled: cancel && cancelUrl ? Boolean(cancelUrl) : Boolean(failUrl),
            noIcon: true,
            showCancelBtn: false,
            isUnicalization: false
        });
    }, []);

    ym("reachGoal", cancel ? "cancel-page" : "general-error-page");

    return (
        <Page>
            <Content>
                <HeadingContainer grow headingText={t(cancel ? "cancelPage.cancel" : "error", ns)} />
                <ContentDescription
                    text={t(cancel ? "cancelPage.transactionCanceled" : "pleaseRepeatOrder", ns)}
                    lowMb
                    lowMt
                />
                <PlusCircleIcon className={styles.errorImage} />;
                {(failUrl || (cancelUrl && cancel)) && (
                    <>
                        <Text text={t("timerText", ns)} />
                        <DeadLineTimer
                            timerSecondsTo={5}
                            timerCallback={() => window.location.replace(cancel && cancelUrl ? cancelUrl : failUrl)}
                        />
                    </>
                )}
            </Content>

            <Footer />
        </Page>
    );
};
