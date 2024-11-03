/* eslint-disable react/prop-types */
import CircleChecked from "../assets/images/check-circle-green.svg";
import Crist from "../assets/images/plus-circle.svg";

export const DisputeClosed = ({ favor = "success", buttonHandler = () => {} }) => {
    // Favor = true (значит зыкрыт в вашу сторону)

    return (
        <div className="chat_dispute">
            <img
                className="dispute_image"
                src={favor === "success" || favor === "repeat" ? CircleChecked : Crist}
                alt=""
            />
            <div className="dispute_closed">
                <p>Диспут закрыт</p>
                <p>{favor === "fail" ? "в сторону оператора" : "в Вашу сторону"}</p>
            </div>
            <div className="dispute_details">
                <p>
                    {(() => {
                        switch (favor) {
                            case "fail":
                                return "Вы будете перенаправлены на следующий шаг оплаты.";
                            case "success":
                                return "Нажмите Продолжить, чтобы перейти на следующий шаг.";
                            default:
                                return "Оператор дал ошибочную информацию и данного перевода не было. Вам будет представлен новый оператор для вывода средств.";
                        }
                    })()}
                </p>
            </div>

            <button className="dispute_button" onClick={buttonHandler}>
                Продолжить
            </button>
        </div>
    );
};
