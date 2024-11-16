/* eslint-disable react/prop-types */
import { useContext } from "react";
import AppContext from "../AppContext";

export const CardNumberForm = props => {
    const { t } = useContext(AppContext);
    const {
        register,
        // handleSubmit,
        errors,
        cardNumber,
        expiryDate,
        // onSubmit,
        handleCardNumberInputChange,
        handleExpiryInputChange,
        handleExpiryKeyDown,
        handleCvvInputChange,
        cvv
    } = props;
    const ns = { ns: ["PayerData"] };

    return (
        <div className="cardNumberForm">
            <form>
                <div className="cardNumberForm__wrapper">
                    <div className="cardNumberForm__item">
                        <label className="cardNumberForm__label" htmlFor="cardNumber">
                            {t("cardNumber", ns)}:
                        </label>
                        <input
                            {...register("cardNumber")}
                            type="text"
                            id="cardNumber"
                            className="cardNumberForm__input"
                            value={cardNumber}
                            onChange={handleCardNumberInputChange}
                            placeholder={`${t("cardNumber", ns)}:`}
                        />
                        {errors.cardNumber && <p className="error-message">{errors.cardNumber.message}</p>}
                    </div>
                    <div className="cardNumberForm__bottom">
                        <div className="cardNumberForm__item">
                            <label className="cardNumberForm__label" htmlFor="expiryDate">
                                {t("expirationDate", ns)}:
                            </label>
                            <input
                                {...register("expiryDate")}
                                type="text"
                                id="expiryDate"
                                className="cardNumberForm__input"
                                value={expiryDate}
                                onChange={handleExpiryInputChange}
                                onKeyDown={handleExpiryKeyDown}
                                maxLength={5}
                                placeholder="MM/YY"
                            />
                            {errors.expiryDate && <p className="error-message">{errors.expiryDate.message}</p>}
                        </div>
                        <div className="cardNumberForm__item">
                            <label className="cardNumberForm__label" htmlFor="cvv">
                                CVV:
                            </label>
                            <input
                                {...register("cvv")}
                                onChange={handleCvvInputChange}
                                value={cvv}
                                type="text"
                                id="cvv"
                                className="cardNumberForm__input"
                                placeholder="000"
                                maxLength={3}
                            />
                            {errors.cvv && <p className="error-message">{errors.cvv.message}</p>}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
