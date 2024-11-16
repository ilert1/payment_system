import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const useGetCardNumberFormData = (t, ns) => {
    const cardFormSchema = z.object({
        cardNumber: z
            .string()
            .regex(/^\d{4} \d{4} \d{4} \d{4}$/, t("errors.cardValidationError", ns)) // проверяем формат с пробелами
            .length(19, t("errors.expireDateError", ns)),

        expiryDate: z
            .string()
            .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, t("errors.expireDateError", ns))
            .refine(value => {
                const [month, year] = value.split("/").map(Number);
                const currentYear = new Date().getFullYear() % 100;
                const currentMonth = new Date().getMonth() + 1;
                return year > currentYear || (year === currentYear && month >= currentMonth);
            }),
        cvv: z.string().length(3, t("errors.cvvError", ns))
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors
    } = useForm({
        resolver: zodResolver(cardFormSchema),
        mode: "onBlur"
    });

    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");

    const handleCardNumberInputChange = e => {
        clearErrors("cardNumber");
        let value = e.target.value.replace(/\D/g, "");

        value = value.match(/.{1,4}/g)?.join(" ") || "";

        setCardNumber(value.slice(0, 19));
    };

    const handleCvvInputChange = e => {
        clearErrors("cvv");
        let value = e.target.value.replace(/\D/g, "");
        setCvv(value.slice(0, 3));
    };

    const handleExpiryInputChange = e => {
        clearErrors("expiryDate");
        let value = e.target.value.replace(/\D/g, "");

        if (value.length >= 2) {
            let month = Number(value.slice(0, 2));
            if (month > 12) {
                month = 12;
            }
            value = `${String(month).padStart(2, "0")}/${value.slice(2, 4)}`;
        }

        setExpiryDate(value.slice(0, 5));
    };

    const handleExpiryKeyDown = e => {
        if (e.key === "Backspace" && e.target.selectionStart === 3) {
            e.preventDefault();
        }
    };

    return {
        cardFormSchema,
        cardNumber,
        expiryDate,
        cvv,
        errors,
        register,
        handleSubmit,
        setCardNumber,
        setExpiryDate,
        handleCardNumberInputChange,
        handleExpiryInputChange,
        handleExpiryKeyDown,
        handleCvvInputChange
    };
};
