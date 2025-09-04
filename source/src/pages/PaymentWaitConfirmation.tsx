import Loader from "@/shared/ui/Loader";
import Timer from "@/shared/ui/Timer";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";

const PaymentWaitConfirmation = () => {
    return (
        <Page>
            <div className="content">
                <div className="header-container grow">
                    <h1>Прикрепленный файл на проверке</h1>
                </div>
                <div className="description low-mb low-mt">
                    <p>Как только провайдер подтвердит перевод, ваш счет пополнится</p>
                </div>
                <div className="loader-container">
                    <Loader />
                    <Timer />
                    <p className="status-comment">Обычно проверка занимает до 20 минут</p>
                </div>
            </div>

            <Footer />
        </Page>
    );
};

export default PaymentWaitConfirmation;
