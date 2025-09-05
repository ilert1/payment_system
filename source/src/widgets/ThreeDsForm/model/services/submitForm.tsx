import { AppRoutes } from "@/shared/const/router";
import { SubmitFormParams } from "../types/threeDSFormTypes";

export const submitForm = async ({
    formData,
    fingerprintHeaders,
    dest,
    bfId,
    navigate,
    payOutMode,
    setStatus
}: SubmitFormParams): Promise<BFDataType | undefined> => {
    const url = `${import.meta.env.VITE_API_URL}/${dest}s/${bfId}/events`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { ...fingerprintHeaders, "Content-Type": "application/json" },
            body: JSON.stringify({
                event: "paymentPayerConfirm",
                payload: {
                    confirm_code: formData.threeDsCode
                }
            })
        });

        if (!response.ok) {
            if (response.status === 404) {
                navigate(`/${payOutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`);
            }
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data: BFDataType & { success?: boolean; error?: string; state?: string } = await response.json();

        if (data?.success) {
            console.log("Three ds form submit data: ", data);
            return data;
        } else {
            if (data?.error == "8001") {
                if (data?.state) setStatus(data.state);
                return;
            }
            navigate(`/${payOutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`);
            return undefined;
        }
    } catch (error) {
        console.error("Fetch error", error);
        return undefined;
    }
};
