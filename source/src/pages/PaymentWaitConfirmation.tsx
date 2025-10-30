import { ContentDescription } from "@/entities/payment";
import Loader from "@/shared/ui/Loader/Loader";
import { Content, HeadingContainer } from "@/widgets/Content";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";

const PaymentWaitConfirmation = () => {
    return (
        <Page>
            <Content>
                <HeadingContainer headingText={"Прикрепленный файл на проверке"} grow />
                <ContentDescription text={"Как только провайдер подтвердит перевод, ваш счет пополнится"} lowMb lowMt />
                <Loader timer={true} statusText={"Обычно проверка занимает до 20 минут"} />
            </Content>

            <Footer />
        </Page>
    );
};

export default PaymentWaitConfirmation;
