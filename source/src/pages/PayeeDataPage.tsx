import { ContentDescription } from "@/entities/payment";
import { usePaymentPage } from "@/shared/hooks/usePaymentPage";
import { useBFStore } from "@/shared/store/bfDataStore";
import { Content, HeadingContainer } from "@/widgets/Content";
import { Page } from "@/widgets/Page";
import { useAppContext } from "../AppContext";
import { Loader } from "../shared/ui/Loader/Loader";
import { Footer } from "../widgets/Footer";

const PayeeDataPage = () => {
    const { t, getCurrencySymbol, ym } = useAppContext();
    const BFData = useBFStore(state => state.BFData);

    ym("reachGoal", "payee-data-page");

    //translation
    const ns = { ns: "PayeeData" };
    const payOutMode = Boolean(BFData?.payout);
    const dest = payOutMode ? "payout" : "payment";

    usePaymentPage({ absolutePath: false });

    const redirect = (url: string) => {
        window.location.replace(url);
    };

    const buttonCallback = () => {
        ym("reachGoal", "back-return-button", {
            back_redirect_url: BFData?.[dest]?.method?.context?.back_redirect_url
        });
        redirect(BFData?.[dest]?.method?.context?.back_redirect_url ?? "");
    };

    const headingText =
        t("waitConfirmation", ns) +
        BFData?.[dest]?.amount +
        "\u00A0" +
        getCurrencySymbol(BFData?.[dest]?.currency ?? "");

    return (
        <Page>
            <Content>
                <HeadingContainer headingText={headingText} grow />
                <ContentDescription text={t("waitComment", ns)} lowMb lowMt />
                <Loader timer={true} statusText={t("waitTime", ns)} />
            </Content>

            <Footer
                buttonCallback={BFData?.[dest]?.method?.context?.back_redirect_url ? buttonCallback : () => {}}
                buttonCaption={BFData?.[dest]?.method?.context?.back_redirect_url ? t("backToSite", ns) : ""}
                nextPage={BFData?.[dest]?.method?.context?.back_redirect_url}
                payeeCard={true && !!BFData?.[dest]?.method?.payee?.data}
                showCancelBtn={false}
                hideRequisite={
                    BFData?.[dest]?.method?.payee?.data?.phone_number &&
                    BFData?.[dest]?.currency === "RUB" &&
                    BFData?.[dest]?.method?.payee?.redirect_url
                        ? true
                        : false
                }
            />
        </Page>
    );
};

export default PayeeDataPage;
