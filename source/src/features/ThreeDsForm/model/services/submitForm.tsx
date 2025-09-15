import { SubmitFormParams } from "../types/threeDSFormTypes";

interface ThreeDsFormResponse extends BFDataType, AppResponseType {}

export const submitForm = async ({
    formData,
    fingerprintHeaders,
    dest,
    bfId,
    setStatus
}: SubmitFormParams): Promise<ThreeDsFormResponse | undefined> => {
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
                throw new Error("404");
            }
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data: ThreeDsFormResponse = await response.json();

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
