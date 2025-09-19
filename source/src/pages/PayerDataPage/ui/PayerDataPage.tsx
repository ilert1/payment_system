import { useAppContext } from "@/AppContext";
import { usePaymentPage } from "@/shared/hooks/usePaymentPage";
import { CardNumberForms } from "@/widgets/CardNumberForms";
import { Content } from "@/widgets/Content";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";

const PayerDataPage = () => {
    const { ym } = useAppContext();
    ym("reachGoal", "payer-data-page");

    usePaymentPage({ absolutePath: false });

    return (
        <Page>
            <Content>
                <CardNumberForms />
            </Content>
            <Footer />
        </Page>
    );
};

export default PayerDataPage;
