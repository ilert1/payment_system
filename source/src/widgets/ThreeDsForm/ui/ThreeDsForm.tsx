import { Input } from "@/shared/ui/input/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import styles from "./ThreeDsForm.module.scss";
import { toast } from "react-toastify";
import { AppRoutes } from "@/shared/const/router";
import Footer from "@/widgets/Footer";
import { useThreeDSFormStore } from "../model/slice/ThreeDSFormSlice";
import { ThreeDsFormValues } from "../model/types/threeDSFormTypes";
import { useNavigate } from "react-router-dom";

export const ThreeDsForm = () => {
    const { t } = useTranslation("ThreeDsPage");
    const { isFetching, submitForm } = useThreeDSFormStore();
    const navigate = useNavigate();

    const ThreeDsFormSchema = z.object({
        threeDsCode: z
            .string()
            .min(1, "Код не может быть пустым")
            .max(10, "Код не должен превышать 10 символов")
            .refine(value => /^[a-zA-Z0-9]*$/.test(value), {
                message: "Код может содержать только латинские буквы и цифры"
            })
    });

    const threeDSForm = useForm<ThreeDsFormValues>({
        resolver: zodResolver(ThreeDsFormSchema),
        defaultValues: {
            threeDsCode: ""
        }
    });

    const onSubmit = (data: ThreeDsFormValues) => {
        try {
            submitForm({ formData: data, navigate });
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <>
            <div className="content cardPage">
                <h1
                    className="grow"
                    style={{
                        marginBottom: "20px"
                    }}>
                    {t("title")}
                </h1>
                <form onSubmit={threeDSForm.handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.item}>
                        <label className={styles.label}>{t("threeDSForm.fields.threeDsCode")}</label>
                        <Controller
                            name="threeDsCode"
                            control={threeDSForm.control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    textSize="lg"
                                    placeholder={t("threeDSForm.fields.threeDsCodePlaceholder")}
                                    onChange={e => {
                                        if (e.target.value.length > 0 && !e.target.value.match(/[a-zA-Z0-9]/)) {
                                            toast.error(t("threeDSForm.errors.regex"), {
                                                autoClose: 2000,
                                                position: "top-center"
                                            });
                                            return;
                                        }
                                        threeDSForm.setValue(
                                            "threeDsCode",
                                            e.target.value.replace(/[^a-zA-Z0-9]/g, "")
                                        );
                                    }}
                                    className={styles.input}
                                />
                            )}
                        />
                        {threeDSForm.formState.errors.threeDsCode && (
                            <span className={styles.helperText}>{t("threeDSForm.errors.generalError")}</span>
                        )}
                    </div>
                </form>
            </div>
            <Footer
                buttonCaption={t("continue")}
                buttonCallback={() => onSubmit(threeDSForm.getValues())}
                nextPage={AppRoutes.PAYEE_SEARCH_PAGE}
                nextEnabled={!isFetching}
                approve={true}
                focused={true}
            />
        </>
    );
};
