import Loader from "@/shared/ui/Loader/Loader";
import { Text } from "@/shared/ui/Text/Heading";
import { ContentDescription } from "@/widgets/Content";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";

const PaymentWaitConfirmation = () => {
    return (
        <Page>
            <div className="content">
                <div className="header-container grow">
                    <Text size="l" title={"Прикрепленный файл на проверке"} />
                </div>
                <ContentDescription text={"Как только провайдер подтвердит перевод, ваш счет пополнится"} lowMb lowMt />
                <Loader timer={true} statusText={"Обычно проверка занимает до 20 минут"} />
            </div>

            <Footer />
        </Page>
    );
};

export default PaymentWaitConfirmation;
