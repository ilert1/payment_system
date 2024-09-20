import CircleChecked from "../assets/images/check-circle-green.svg";
import Crist from "../assets/images/plus-circle.svg";

export const DisputeClosed = ({ favor }) => {
    // Favor = true (значит зыкрыт в вашу сторону)

    return (
        <div className="chat_dispute">
            <img className="dispute_image" src={favor ? CircleChecked : Crist} alt="" />
            <div className="dispute_closed">
                <p>Диспут закрыт</p>
                <p>{favor ? "в Вашу сторону" : "в сторону оператора"}</p>
            </div>
            <div className="dispute_details">
                <p>{favor ? "Вам будет представлен новый" : "Вы будете перенаправлены на "}</p>
                <p>{favor ? "оператор для оплаты части вывода." : "следующий шаг оплаты."}</p>
            </div>
        </div>
    );
};
