import Loader from "@/shared/ui/Loader/Loader";
import { ContentDescription } from "@/widgets/Content";
import { HeadingContainer } from "@/widgets/Content/ui/HeadingContainer/HeadingContainer";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";

const PaymentWaitConfirmation = () => {
    return (
        <Page>
            <div className="content">
                <HeadingContainer headingText={"Прикрепленный файл на проверке"} grow />
                <ContentDescription text={"Как только провайдер подтвердит перевод, ваш счет пополнится"} lowMb lowMt />
                <Loader timer={true} statusText={"Обычно проверка занимает до 20 минут"} />
            </div>

            <Footer />
        </Page>
    );
};

export default PaymentWaitConfirmation;
