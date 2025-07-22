import { useTranslation } from "react-i18next";
import { z } from "zod";

export const ThreeDsForm = () => {
    const { t } = useTranslation("ThreeDsForm");

    const threeDSFormSchema = z.object({
        threeDsCode: z.string()
    });

    return <div>ThreeDsForm</div>;
};
