/* eslint-disable react/prop-types */
import { ChangeEventHandler, useContext } from "react";
import AppContext from "../AppContext";
import { useTranslation } from "react-i18next";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface CardNumberFormProps {
    disabled: boolean;
    cardHolderVisible: boolean;

    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolder: string;

    handleCardNumberInputChange: ChangeEventHandler<HTMLInputElement>;
    handleExpiryInputChange: ChangeEventHandler<HTMLInputElement>;
    handleCvvInputChange: ChangeEventHandler<HTMLInputElement>;
    handleCardHolderChange: ChangeEventHandler<HTMLInputElement>;
    // handleCardNumberInputChange: (val: string) => void;
    // handleExpiryInputChange: (val: string) => void;
    // handleCvvInputChange: (val: string) => void;
    // handleCardHolderChange: (val: string) => void;

    handleExpiryKeyDown: () => void;

    // todo
    errors: FieldErrors;
    register: UseFormRegister<FieldValues>;
}

export const CardNumberForm = (props: CardNumberFormProps) => {
    const { t } = useTranslation();
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
        disabled,
        cardHolder,
        handleCardHolderChange,
        cardHolderVisible
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
                            placeholder={`${t("cardNumber", ns)}`}
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
                    {cardHolderVisible && (
                        <div className="card-number-form__item">
                            <label className="card-number-form__label" htmlFor="cardHolder">
                                {t("cardHolder", ns)}:
                            </label>
                            <input
                                {...register("cardHolder", { required: false })}
                                type="text"
                                id="cardHolder"
                                className="card-number-form__input wide-spacing"
                                value={cardHolder}
                                onChange={handleCardHolderChange}
                                placeholder={`${t("nameLastname", ns)}`}
                            />
                            {errors.cardHolder && <p className="error-message">{errors.cardHolder.message}</p>}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};
