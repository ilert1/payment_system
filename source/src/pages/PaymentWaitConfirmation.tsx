import Header from "@/widgets/Header";
import Footer from "@/widgets/Footer";

import Timer from "@/shared/ui/Timer";
import Loader from "@/shared/ui/Loader";

const PaymentWaitConfirmation = () => {
    return (
        <div className="container">
            <Header />

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
        </div>
    );
};

export default PaymentWaitConfirmation;
