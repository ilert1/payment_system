import Loader from "@/shared/ui/Loader/Loader";
import { Text } from "@/shared/ui/Text/Text";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";

const PaymentWaitConfirmation = () => {
    return (
        <Page>
            <div className="content">
                <div className="header-container grow">
                    <Text size="l" title={"Прикрепленный файл на проверке"} />
                </div>
                <div className="description low-mb low-mt">
                    <p>Как только провайдер подтвердит перевод, ваш счет пополнится</p>
                </div>
                <Loader timer={true} statusText={"Обычно проверка занимает до 20 минут"} />
            </div>

            <Footer />
        </Page>
    );
};

export default PaymentWaitConfirmation;
