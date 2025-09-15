import { ThreeDsForm } from "@/features/ThreeDsForm";
import { Content } from "@/widgets/Content";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";

export const ThreeDSPage = () => {
    return (
        <Page>
            <Content>
                <ThreeDsForm />
            </Content>
            <Footer />
        </Page>
    );
};
