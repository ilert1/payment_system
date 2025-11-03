import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import { useAppContext } from "@/AppContext";
import { AppRoutes } from "@/shared/const/router";
import { useFooterStore } from "@/shared/store/FooterStore/slice/FooterSlice";
import { useBFStore } from "@/shared/store/bfDataStore";
import { Heading } from "@/shared/ui/Heading/Heading";
import { Label } from "@/shared/ui/Label";
import Loader from "@/shared/ui/Loader/Loader";
import { Text } from "@/shared/ui/Text/Text";
import { Input } from "@/shared/ui/input/input";
import { useThreeDSFormStore } from "../model/slice/ThreeDSFormSlice";
import { ThreeDsFormValues } from "../model/types/threeDSFormTypes";
import styles from "./ThreeDsForm.module.scss";

export const ThreeDsForm = () => {
    const { t } = useTranslation("ThreeDsPage");
    const setFooter = useFooterStore(state => state.setFooter);
    const navigate = useNavigate();
    const { fingerprintConfig } = useAppContext();

    const { submitForm } = useThreeDSFormStore();

    const status = useBFStore(state => state.status);
    const bfData = useBFStore(state => state.BFData);
    const payOutMode = Boolean(bfData?.payout);

    const [buttonEnabled, setButtonEnabled] = useState(false);
    const [submitClicked, setSubmitClicked] = useState(false);

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
        if (submitClicked) return;
        setSubmitClicked(true);

        try {
            submitForm({ formData: data, navigate, fingerprintConfig: fingerprintConfig.headers });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "404") {
                    navigate(`/${payOutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`);
                } else {
                    toast.error(error.message);
                }
            } else {
                toast.error("Something went wrong");
            }
            setSubmitClicked(false);
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

    useEffect(() => {
        setFooter({
            buttonCaption: t("continue"),
            buttonCallback: threeDSForm.handleSubmit(onSubmit),
            nextPage: AppRoutes.PAYEE_SEARCH_PAGE,
            nextEnabled: !submitClicked && buttonEnabled,
            approve: true,
            focused: true,
            showCancelBtn: false,
            isUnicalization: false
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buttonEnabled, submitClicked]);

    if (status === "paymentAwaitingConfirmationByPayee") {
        return <Loader />;
    }

    return (
        <>
            <Heading size="l" title={t("title")} grow className={styles.h1} />
            <form className={styles.form}>
                <div className={styles.item}>
                    <Label weight="medium" text={t("threeDSForm.fields.threeDsCode")} className={styles.label} />
                    <Controller
                        name="threeDsCode"
                        control={threeDSForm.control}
                        disabled={submitClicked}
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
                        <Text
                            className={styles.errorMessage}
                            size="xxs"
                            variant="error"
                            text={t("threeDSForm.errors.generalError")}
                        />
                    )}
                </div>
            </form>
        </>
    );
};
