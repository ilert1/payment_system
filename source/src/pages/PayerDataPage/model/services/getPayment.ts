import { AppRoutes } from "@/shared/const/router";
import { GetPaymentParams } from "../types/PayerDataPageTypes";

export const getPayment = async ({
    bfId,
    dest,
    fingerprintHeaders,
    payOutMode,
    setBfData,
    navigate
}: GetPaymentParams): Promise<BFDataType | undefined> => {
    const url = `${import.meta.env.VITE_API_URL}/${dest}s/${bfId}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: fingerprintHeaders
        });

        if (!response.ok) {
            if (response.status === 404) {
                navigate(`/${payOutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`);
            }
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data: BFDataType & { success?: boolean } = await response.json();

        if (data?.success) {
            setBfData(data);
            return data;
        } else {
            navigate(`/${payOutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`);
            return undefined;
        }
    } catch (error) {
        console.error("Fetch error", error);
        return undefined;
    }
};
