import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import { useAppContext } from "@/AppContext";
import usePaymentPage from "@/hooks/usePaymentPage";
import { AppRoutes } from "@/shared/const/router";
import { useBFStore } from "@/shared/store/bfDataStore";
import Loader from "@/shared/ui/Loader";
import { Input } from "@/shared/ui/input/input";
import { Footer } from "@/widgets/Footer";
import { Page } from "@/widgets/Page";
import { useThreeDSFormStore } from "../model/slice/ThreeDSFormSlice";
import { ThreeDsFormValues } from "../model/types/threeDSFormTypes";
import styles from "./ThreeDsForm.module.scss";

export const ThreeDsForm = () => {
    const status = useBFStore(state => state.status);
    const { fingerprintConfig } = useAppContext();
    const { t } = useTranslation("ThreeDsPage");
    const { isFetching, submitForm } = useThreeDSFormStore();
    const navigate = useNavigate();
    const [buttonEnabled, setButtonEnabled] = useState(false);

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
        mode: "all",
        defaultValues: {
            threeDsCode: ""
        }
    });

    const onSubmit = (data: ThreeDsFormValues) => {
        try {
            submitForm({ formData: data, navigate, fingerprintConfig: fingerprintConfig.headers });
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        console.log(threeDSForm.formState.errors.threeDsCode);
    }, [threeDSForm.formState.errors]);

    const val = threeDSForm.watch("threeDsCode");

    useEffect(() => {
        if (val.length > 0) {
            setButtonEnabled(true);
        } else {
            setButtonEnabled(false);
        }
    }, [val]);

    usePaymentPage({ absolutePath: false });

    if (status === "paymentAwaitingConfirmationByPayee") {
        return (
            <div className="content">
                <div className="loader-container">
                    <Loader />
                </div>
            </div>
        );
    }

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
                {/* onSubmit={threeDSForm.handleSubmit(onSubmit)} */}
                <form className={styles.form}>
                    <div className={styles.item}>
                        <label className={styles.label}>{t("threeDSForm.fields.threeDsCode")}</label>
                        <Controller
                            name="threeDsCode"
                            control={threeDSForm.control}
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
                                    placeholder={t("threeDSForm.fields.threeDsCodePlaceholder")}
                                    onChange={e => {
                                        if (e.target.value.length > 0 && !e.target.value.match(/[a-zA-Z0-9]/)) {
                                            threeDSForm.setError("threeDsCode", {
                                                type: "pattern",
                                                message: t("threeDSForm.errors.regex")
                                            });
                                            return;
                                        }
                                        threeDSForm.clearErrors();
                                        threeDSForm.setValue(
                                            "threeDsCode",
                                            e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10)
                                        );
                                    }}
                                    className={styles.input}
                                />
                            )}
                        />
                        {threeDSForm.formState.errors.threeDsCode && (
                            <span className={styles.errorMessage}>{t("threeDSForm.errors.generalError")}</span>
                        )}
                    </div>
                </form>
            </div>
            <Footer
                buttonCaption={t("continue")}
                buttonCallback={threeDSForm.handleSubmit(onSubmit)}
                nextPage={AppRoutes.PAYEE_SEARCH_PAGE}
                nextEnabled={buttonEnabled && !isFetching}
                approve={true}
                focused={true}
            />
        </>
    );
};
