import { useContext } from "react";
import AppContext from "../AppContext";

export const CardNumberForm = props => {
    const { t } = useContext(AppContext);
    const ns = { ns: ["PayerData"] };

    return (
        <div className="cardNumberForm">
            <form action="">
                <div className="cardNumberForm__wrapper">
                    <div className="cardNumberForm__item">
                        <label htmlFor="">{t("cardNumber", ns)}:</label>
                        <input type="text" className="cardNumberForm__input" />
                    </div>
                    <div className="cardNumberForm__bottom">
                        <div className="cardNumberForm__item">
                            <label htmlFor="">{t("expirationDate", ns)}:</label>
                            <input type="text" className="cardNumberForm__input" />
                        </div>
                        <div className="cardNumberForm__item">
                            <label htmlFor="">CVV:</label>
                            <input type="text" className="cardNumberForm__input" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
