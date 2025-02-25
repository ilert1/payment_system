import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext, useState } from "react";
import AppContext from "../AppContext";
import PlusCircle from "../assets/images/plus-circle.svg";
import Timer from "../ui/Timer.jsx";
import Loader from "../ui/Loader.jsx";

const PaymentWaitConfirmation = () => {
    const { navigate, t } = useContext(AppContext);
    const { setIsActive } = useContext(AppContext).supportDialog;

    //translation
    const ns = { ns: "PaymentWaitConfirmation" };

    const [isComplete, setIsComplete] = useState(false);
    const [buttonFocused, setButtonFocused] = useState(false);

    const onComplete = () => {
        setIsComplete(true);
        setButtonFocused(true);
    };

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
