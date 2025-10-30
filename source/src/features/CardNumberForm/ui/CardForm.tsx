 
import { useTranslation } from "react-i18next";
import { classNames } from "@/shared/lib/classNames";
import { Label } from "@/shared/ui/Label";
import { Text } from "@/shared/ui/Text/Text";
import { Input } from "@/shared/ui/input/input";
import { useGetCardNumberFormData } from "@/widgets/CardNumberForms/model/hooks/useGetCardNumberFormData";
import { useCardFormStore } from "../model/slice/CardFormSlice";
import styles from "./CardForm.module.scss";

interface CardNumberFormProps {
    disabled: boolean;
    cardHolderVisible: boolean;
}

export const CardNumberForm = (props: CardNumberFormProps) => {
    const ns = { ns: ["Common", "PayerData", "PayOut"] };

    const { t } = useTranslation();
    const { cardNumber, expiryDate, cvv, cardHolder } = useCardFormStore();

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
                        <Label text={t("cardNumber", ns)} weight="medium" />
                        <Input
                            {...register("cardNumber")}
                            id="cardNumber"
                            className={classNames(styles.input, {}, [styles.wideSpacing])}
                            value={cardNumber}
                            onChange={handleCardNumberInputChange}
                            placeholder={`${t("cardNumber", ns)}`}
                            disabled={disabled}
                        />
                        {errors.cardNumber && <Text size="xxs" variant={"error"} text={errors.cardNumber.message} />}
                    </div>
                    <div className={styles.bottom}>
                        <div className={styles.item}>
                            <Label text={t("expirationDate", ns)} weight="medium" />
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
                            {errors.expiryDate && (
                                <Text size="xxs" variant={"error"} text={errors.expiryDate.message} />
                            )}
                        </div>
                        <div className={styles.item}>
                            <Label text="CVV" weight="medium" />
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
                            {errors.cvv && <Text size="xxs" variant={"error"} text={errors.cvv.message} />}
                        </div>
                    </div>
                    {cardHolderVisible && (
                        <div className={styles.item}>
                            <Label text={t("cardHolder", ns)} weight="medium" />
                            <Input
                                {...register("cardHolder", { required: false })}
                                id="cardHolder"
                                className={classNames(styles.input, {}, [styles.wideSpacing])}
                                value={cardHolder}
                                onChange={handleCardHolderChange}
                                placeholder={`${t("nameLastname", ns)}`}
                                disabled={disabled}
                            />
                            {errors.cardHolder && (
                                <Text size="xxs" variant={"error"} text={errors.cardHolder.message} />
                            )}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};
