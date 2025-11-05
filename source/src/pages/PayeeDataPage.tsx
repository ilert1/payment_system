import { useEffect, useMemo } from "react";
import { ContentDescription } from "@/entities/payment";
import { usePaymentPage } from "@/shared/hooks/usePaymentPage";
import { useFooterStore } from "@/shared/store/FooterStore/slice/FooterSlice";
import { useBFStore } from "@/shared/store/bfDataStore";
import { Content, HeadingContainer } from "@/widgets/Content";
import { Page } from "@/widgets/Page";
import { useAppContext } from "../AppContext";
import { Loader } from "../shared/ui/Loader/Loader";
import { Footer } from "../widgets/Footer";

const PayeeDataPage = () => {
    const { t, getCurrencySymbol, ym } = useAppContext();
    const BFData = useBFStore(state => state.BFData);
    const setFooter = useFooterStore(state => state.setFooter);

    ym("reachGoal", "payee-data-page");

    //translation
    const ns = useMemo(() => ({ ns: "PayeeData" }), []);
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
        " " +
        BFData?.[dest]?.amount +
        "\u00A0" +
        getCurrencySymbol(BFData?.[dest]?.currency ?? "");

    const backRedirectUrl = BFData?.[dest]?.method?.context?.back_redirect_url ?? "";
    const trader = BFData?.[dest]?.method?.payee?.data;
    const currency = BFData?.[dest]?.currency ?? "";
    const redirectUrl = BFData?.[dest]?.method?.payee?.redirect_url ?? "";

    useEffect(() => {
        setFooter({
            buttonCallback: backRedirectUrl ? buttonCallback : () => {},
            buttonCaption: backRedirectUrl ? t("backToSite", ns) : "",
            nextEnabled: backRedirectUrl ? true : false,
            nextPage: backRedirectUrl,
            payeeCard: true && !!trader,
            showCancelBtn: false,
            hideRequisite: trader?.phone_number && currency === "RUB" && redirectUrl ? true : false,
            isUnicalization: false,
            approve: false
        });
    }, [backRedirectUrl, trader, currency, redirectUrl, ns, t, setFooter]);

    return (
        <Page>
            <Content>
                <HeadingContainer headingText={headingText} grow center />
                <ContentDescription text={t("waitComment", ns)} lowMb lowMt />
                <Loader timer={true} statusText={t("waitTime", ns)} />
            </Content>
            <Footer />
        </Page>
    );
};

export default PayeeDataPage;
