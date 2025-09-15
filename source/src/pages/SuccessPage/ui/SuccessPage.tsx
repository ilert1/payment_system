import { useAppContext } from "@/AppContext";
import usePaymentPage from "@/hooks/usePaymentPage";
import { useBFStore } from "@/shared/store/bfDataStore";
import { DeadLineTimer } from "@/shared/ui/DeadlineTimer/DeadLineTimer";
import { Text } from "@/shared/ui/Text/Text";
import { Content } from "@/widgets/Content";
import { HeadingContainer } from "@/widgets/Content/ui/HeadingContainer/HeadingContainer";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";

export const SuccessPage = () => {
    const { t, getCurrencySymbol, payoutMode, ym } = useAppContext();
    ym("reachGoal", "success-page");
    const BFData = useBFStore(state => state.BFData);

    const ns = { ns: "Success" };

    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    const successUrl = BFData?.[dest]?.method?.context?.success_redirect_url ?? "";

    const successCallback = () => {
        ym("reachGoal", "success-return-button", { success_url: successUrl });
        window.location.replace(successUrl);
    };

    usePaymentPage({ absolutePath: false });

    return (
        <Page>
            <Content>
                <HeadingContainer
                    grow
                    wide
                    center
                    headingText={t(payoutMode ? "payoutHeader" : "header", ns)}
                    description={`+ ${BFData?.[dest]?.amount} ${getCurrencySymbol(BFData?.[dest]?.currency ?? "")}`}
                />
                {successUrl && (
                    <>
                        <Text text={t("timerText", ns)} />
                        <DeadLineTimer timerSecondsTo={5} timerCallback={successCallback} />
                    </>
                )}
            </Content>

            <Footer
                buttonCaption={t("returnBtn", ns)}
                buttonCallback={() => window.location.replace(successUrl)}
                nextPage={successUrl}
                nextEnabled={Boolean(successUrl)}
                noIcon={true}
                showCancelBtn={false}
            />
        </Page>
    );
};
