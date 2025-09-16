import { ThreeDsForm } from "@/features/ThreeDsForm";
import { usePaymentPage } from "@/shared/hooks/usePaymentPage";
import { Content } from "@/widgets/Content";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";

export const ThreeDSPage = () => {
    usePaymentPage({ absolutePath: false });

    return (
        <Page>
            <Content>
                <ThreeDsForm />
            </Content>
            <Footer />
        </Page>
    );
};
