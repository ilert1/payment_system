import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import { Button } from "@/shared/ui/Button/Button";
import { Label } from "@/shared/ui/Label";
import { Text } from "@/shared/ui/Text/Text";
import { Input } from "@/shared/ui/input/input";
import styles from "./TransactionTypeForm.module.scss";

interface TransactionTypeFormValues {
    transactionType: string;
}

interface TransactionTypeFormProps {
    data: {
        title: string;
        text: string;
        primaryBtnText?: string;
        primaryBtnCallback?: () => void;
        secondaryBtnText?: string;
        secondaryBtnCallback?: () => void;
        isCancel?: boolean;
        closeCallback?: () => void;
    };
}

export const TransactionTypeForm = (props: TransactionTypeFormProps) => {
    const { data } = props;
    const { t } = useTranslation("Pay");

    const TransactionTypeFormSchema = z.object({
        transactionType: z
            .string()
            .min(1, t("transactionTypeForm.errors.cannotBeEmpty"))
            .regex(/^[A-Za-z0-9]+$/, t("transactionTypeForm.errors.regex"))
    });

    const transactionTypeForm = useForm<TransactionTypeFormValues>({
        resolver: zodResolver(TransactionTypeFormSchema),
        mode: "all",
        defaultValues: {
            transactionType: ""
        }
    });

    return (
        <>
            <form>
                <div className={styles.item}>
                    <Label
                        weight="medium"
                        text={t("transactionTypeForm.fields.transactionType")}
                        className={styles.label}
                    />
                    <Controller
                        name="transactionType"
                        control={transactionTypeForm.control}
                        rules={{
                            required: true,
                            minLength: 1,
                            maxLength: 10,
                            pattern: /^[a-zA-Z0-9]*$/
                        }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                textSize="lg"
                                placeholder={t("transactionTypeForm.fields.transactionTypePlaceholder")}
                                onChange={e => {
                                    if (e.target.value.length > 0 && !/^[a-zA-Z0-9]*$/.test(e.target.value)) {
                                        transactionTypeForm.setError("transactionType", {
                                            type: "pattern",
                                            message: t("transactionTypeForm.errors.regex")
                                        });
                                        return;
                                    }
                                    const val = e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 50);
                                    transactionTypeForm.clearErrors();
                                    transactionTypeForm.setValue("transactionType", val);
                                }}
                                className={styles.input}
                            />
                        )}
                    />
                    {transactionTypeForm.formState.errors.transactionType && (
                        <Text
                            className={styles.errorMessage}
                            size="xxs"
                            variant="error"
                            text={transactionTypeForm.formState.errors.transactionType.message}
                            noWrapBalance
                        />
                    )}
                </div>
            </form>

            <div className={styles.buttonsBlock}>
                <div className={styles.buttonsSubmit}>
                    <Button
                        disabled={transactionTypeForm.getValues("transactionType").length === 0}
                        onClick={data.primaryBtnCallback}
                        variant={"default"}
                        size={"lg"}
                        className={styles.button}>
                        {t("transactionTypeForm.buttons.confirm")}&nbsp;
                    </Button>

                    <Button
                        size={"lg"}
                        variant={"outline"}
                        onClick={data.secondaryBtnCallback}
                        className={styles.button}>
                        {t("transactionTypeForm.buttons.cancel")}
                    </Button>
                </div>
            </div>
        </>
    );
};
