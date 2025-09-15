import { StartPaymentParams } from "../types/paymentStartTypes";

interface StartPaymentResponseType extends BFDataType, AppResponseType {}

export const startPayment = async ({
    fingerprintHeaders,
    dest,
    bfId,
    setStatus
}: StartPaymentParams): Promise<StartPaymentResponseType | undefined> => {
    const baseApiURL = import.meta.env.VITE_API_URL;
    const url = `${baseApiURL}/${dest}s/${bfId}/events`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { ...fingerprintHeaders, "Content-Type": "application/json" },
            body: JSON.stringify({
                event: "paymentPayerStart"
            })
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("404");
            }
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data: StartPaymentResponseType = await response.json();

        if (data?.success) {
            console.log("Three ds form submit data: ", data);
            return data;
        } else {
            if (data?.error == "8001") {
                if (data?.state) setStatus(data.state);
                return;
            } else {
                throw new Error(data?.error_details ? data.error_details : data?.error);
            }
        }
    } catch (error) {
        console.error("Fetch error", error);
        throw error;
    }
};
