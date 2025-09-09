/* eslint-disable react/prop-types */
import { ChangeEventHandler, KeyboardEvent } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CardFormSchemaType, useGetCardNumberFormData } from "@/hooks/useGetCardNumberFormData";
import { classNames } from "@/shared/lib/classNames";
import { Input } from "@/shared/ui/input/input";
import { usePayerDataStore } from "../model/slice/CardNumberFormSlice";
import styles from "./CardNumberForm.module.scss";

interface CardNumberFormProps {
    disabled: boolean;
    cardHolderVisible: boolean;
}

export const CardNumberForm = (props: CardNumberFormProps) => {
    const ns = { ns: ["Common", "PayerData", "PayOut"] };

    const { t } = useTranslation();
    const { cardNumber, expiryDate, cvv, cardHolder } = usePayerDataStore();

    const {
        register,
        errors,
        handleCardHolderChange,
        handleCvvInputChange,
        handleExpiryKeyDown,
        handleExpiryInputChange,
        handleCardNumberInputChange
    } = useGetCardNumberFormData({ ns });

    const { disabled, cardHolderVisible } = props;

    return (
        <div className={styles.form}>
            <form>
                <div className={styles.wrapper}>
                    <div className={styles.item}>
                        <label className={styles.label} htmlFor="cardNumber">
                            {t("cardNumber", ns)}:
                        </label>
                        <Input
                            {...register("cardNumber")}
                            id="cardNumber"
                            className={classNames(styles.input, {}, [styles.wideSpacing])}
                            value={cardNumber}
                            onChange={handleCardNumberInputChange}
                            placeholder={`${t("cardNumber", ns)}`}
                            disabled={disabled}
                        />
                        {errors.cardNumber && <p className={styles.errorMessage}>{errors.cardNumber.message}</p>}
                    </div>
                    <div className={styles.bottom}>
                        <div className={styles.item}>
                            <label className={styles.label} htmlFor="expiryDate">
                                {t("expirationDate", ns)}:
                            </label>
                            <Input
                                {...register("expiryDate")}
                                id="expiryDate"
                                className={styles.input}
                                value={expiryDate}
                                onChange={handleExpiryInputChange}
                                onKeyDown={handleExpiryKeyDown}
                                maxLength={5}
                                placeholder="MM/YY"
                                disabled={disabled}
                            />
                            {errors.expiryDate && <p className={styles.errorMessage}>{errors.expiryDate.message}</p>}
                        </div>
                        <div className={styles.item}>
                            <label className={styles.label} htmlFor="cvv">
                                CVV:
                            </label>
                            <Input
                                {...register("cvv")}
                                onChange={handleCvvInputChange}
                                value={cvv}
                                type="password"
                                autoComplete="new-password"
                                id="cvv"
                                className={styles.input}
                                placeholder="000"
                                maxLength={3}
                                disabled={disabled}
                            />
                            {errors.cvv && <p className={styles.errorMessage}>{errors.cvv.message}</p>}
                        </div>
                    </div>
                    {cardHolderVisible && (
                        <div className={styles.item}>
                            <label className={styles.label} htmlFor="cardHolder">
                                {t("cardHolder", ns)}:
                            </label>
                            <Input
                                {...register("cardHolder", { required: false })}
                                id="cardHolder"
                                className={classNames(styles.input, {}, [styles.wideSpacing])}
                                value={cardHolder}
                                onChange={handleCardHolderChange}
                                placeholder={`${t("nameLastname", ns)}`}
                                disabled={disabled}
                            />
                            {errors.cardHolder && <p className={styles.errorMessage}>{errors.cardHolder.message}</p>}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};
