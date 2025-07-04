/* eslint-disable react/prop-types */
import CircleChecked from "../shared/assets/images/check-circle-green.svg?react";
import Crist from "../shared/assets/images/plus-circle.svg?react";

interface DisputeClosedProps {
    favor: "success" | "repeat" | "fail";
    buttonHandler: () => void;
}

export const DisputeClosed = (props: DisputeClosedProps) => {
    const { favor = "success", buttonHandler = () => {} } = props;

    // Favor = true (значит зыкрыт в вашу сторону)

    return (
        <div className="chat_dispute">
            {/* <img
                className="dispute_image"
                src={favor === "success" || favor === "repeat" ? CircleChecked : Crist}
                alt=""
            /> */}
            {favor === "success" || favor === "repeat" ? <CircleChecked /> : <Crist />}
            <div className="dispute_closed">
                <p>Диспут закрыт</p>
                <p>{favor === "fail" ? "в сторону оператора" : "в Вашу сторону"}</p>
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
