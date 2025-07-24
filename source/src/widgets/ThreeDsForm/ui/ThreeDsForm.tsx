import { Input } from "@/shared/ui/input/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import styles from "./ThreeDsForm.module.scss";
import { toast } from "react-toastify";

export const ThreeDsForm = () => {
    const { t } = useTranslation("ThreeDsForm");
    const threeDSFormSchema = z.object({
        threeDsCode: z
            .string()
            .min(1, "")
            .max(10, "")
            .refine(data => {
                if (!data.match(/[a-zA-Z0-9]/)) {
                    return false;
                }
                return true;
            }, "")
    });

    const threeDSForm = useForm<z.infer<typeof threeDSFormSchema>>({
        resolver: zodResolver(threeDSFormSchema),
        defaultValues: {
            threeDsCode: ""
        }
    });
    // Введите до 10 символов, используя только латинские буквы и цифры.
    // Код должен содержать не более 10 символов и состоять только из латинских букв и цифр (без пробелов и знаков).

    const onSubmit = (data: z.infer<typeof threeDSFormSchema>) => {
        console.log(data);
    };

    return (
        <form onSubmit={threeDSForm.handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.item}>
                <label className={styles.label}>Код потверждения:</label>
                <Controller
                    name="threeDsCode"
                    control={threeDSForm.control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            textSize="lg"
                            placeholder="Введите код подтверждения"
                            onChange={e => {
                                if (e.target.value.length > 0 && !e.target.value.match(/[a-zA-Z0-9]/)) {
                                    toast.error(
                                        "Код должен состоять только из латинских букв и цифр (без пробелов и знаков)",
                                        {
                                            autoClose: 2000,
                                            position: "top-center"
                                        }
                                    );
                                    return;
                                }
                                threeDSForm.setValue("threeDsCode", e.target.value.replace(/[^a-zA-Z0-9]/g, ""));
                            }}
                            className={styles.input}
                        />
                    )}
                />
                {threeDSForm.formState.errors.threeDsCode && (
                    <span className={styles.helperText}>
                        Введите до 10 символов, используя только латинские буквы и цифры
                        {/* Код должен содержать не более 10 символов и состоять только из латинских букв и цифр (без пробелов и знаков) */}
                    </span>
                )}
            </div>
        </form>
    );
};
