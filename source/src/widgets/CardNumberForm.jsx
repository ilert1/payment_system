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
        cvv,
        disabled
    } = props;
    const ns = { ns: ["PayerData"] };

    return (
        <div className="card-number-form" disabled={disabled}>
            <form>
                <div className="card-number-form__wrapper">
                    <div className="card-number-form__item">
                        <label className="card-number-form__label" htmlFor="cardNumber">
                            {t("cardNumber", ns)}:
                        </label>
                        <input
                            {...register("cardNumber")}
                            type="text"
                            id="cardNumber"
                            className="card-number-form__input wide-spacing"
                            value={cardNumber}
                            onChange={handleCardNumberInputChange}
                            placeholder={`${t("cardNumber", ns)}:`}
                        />
                        {errors.cardNumber && <p className="error-message">{errors.cardNumber.message}</p>}
                    </div>
                    <div className="card-number-form__bottom">
                        <div className="card-number-form__item">
                            <label className="card-number-form__label" htmlFor="expiryDate">
                                {t("expirationDate", ns)}:
                            </label>
                            <input
                                {...register("expiryDate")}
                                type="text"
                                id="expiryDate"
                                className="card-number-form__input"
                                value={expiryDate}
                                onChange={handleExpiryInputChange}
                                onKeyDown={handleExpiryKeyDown}
                                maxLength={5}
                                placeholder="MM/YY"
                            />
                            {errors.expiryDate && <p className="error-message">{errors.expiryDate.message}</p>}
                        </div>
                        <div className="card-number-form__item">
                            <label className="card-number-form__label" htmlFor="cvv">
                                CVV:
                            </label>
                            <input
                                {...register("cvv")}
                                onChange={handleCvvInputChange}
                                value={cvv}
                                type="password"
                                autoComplete="new-password"
                                id="cvv"
                                className="card-number-form__input"
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
