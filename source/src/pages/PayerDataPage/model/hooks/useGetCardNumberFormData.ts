import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { usePayerDataStore } from "@/features/CardNumberForm";

interface UseGetCardNumberFormDataProps {
    ns: {
        ns: string[];
    };
}

export type CardFormSchemaType = {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolder: string;
};

export const useGetCardNumberFormData = (props: UseGetCardNumberFormDataProps) => {
    const { ns } = props;
    const { t } = useTranslation();
    const { setCardNumber, setExpiryDate, setCvv, setCardHolder } = usePayerDataStore();

    const cardFormSchema = z.object({
        cardNumber: z
            .string()
            .regex(/^\d{4} \d{4} \d{4} \d{4}$/, t("errors.cardValidationError", ns)) // проверяем формат с пробелами
            .length(19, t("errors.cardValidationError", ns)),
        expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, t("errors.expireDateError", ns)),
        cvv: z.string().length(3, t("errors.cvvError", ns)),
        cardHolder: z
            .string()
            .regex(/^[a-zA-Zа-яА-Я]+\s[a-zA-Zа-яА-Я]+$/, t("errors.cardHolderError", ns))
            .optional()
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        clearErrors
    } = useForm<CardFormSchemaType>({
        resolver: zodResolver(cardFormSchema),
        mode: "onBlur"
    });

    const handleCardNumberInputChange = (e: any) => {
        clearErrors("cardNumber");
        let value = e.target.value.replace(/\D/g, "");

        value = value.match(/.{1,4}/g)?.join(" ") || "";

        setCardNumber(value.slice(0, 19));
    };

    const handleCvvInputChange = (e: any) => {
        clearErrors("cvv");
        let value = e.target.value.replace(/\D/g, "");
        setCvv(value.slice(0, 3));
    };

    const handleExpiryInputChange = (e: any) => {
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

    const handleExpiryKeyDown = (e: any) => {
        if (e.key === "Backspace" && e.target.selectionStart === 3) {
            e.preventDefault();
        }
    };

    const handleCardHolderChange = (e: any) => {
        clearErrors("cardHolder");
        let value = e.target.value.replace(/[^a-zA-Zа-яА-Я\s]/g, "");

        value = value.replace(/\s+/g, " ").replace(/^\s+/, "");

        const words = value.split(" ");

        if (words.length > 2) {
            value = words.slice(0, 2).join(" ");
        }

        setCardHolder(value?.toUpperCase());
    };

    return {
        cardFormSchema,
        errors,
        register,
        handleSubmit,
        handleCardNumberInputChange,
        handleExpiryInputChange,
        handleExpiryKeyDown,
        handleCvvInputChange,
        handleCardHolderChange
    };
};
