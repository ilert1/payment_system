/* eslint-disable react/prop-types */
import CircleChecked from "../assets/images/check-circle-green.svg";
import Crist from "../assets/images/plus-circle.svg";

export const DisputeClosed = ({ favor = "success", backButtonHandler = () => {} }) => {
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
                                return "Вы будете перенаправлены на ";
                            case "success":
                                return "Вам будет представлен новый";
                            default:
                                return "оператор дал ошибочную информацию";
                        }
                    })()}
                </p>
                <p>
                    {(() => {
                        switch (favor) {
                            case "fail":
                                return "следующий шаг оплаты.";
                            case "success":
                                return "оператор для оплаты части вывода.";
                            default:
                                return "и данного перевода не было";
                        }
                    })()}
                </p>
            </div>

            <button className="dispute_button" onClick={backButtonHandler}>
                Назад
            </button>
        </div>
    );
};
