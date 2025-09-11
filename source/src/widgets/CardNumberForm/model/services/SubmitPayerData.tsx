import { toast } from "react-toastify";

type PayerPayload = {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolder: string;
};

interface SubmitPayerDataParams {
    form: PayerPayload;
    method: string;
    dest: "payout" | "payment";
    bfId: string;
    baseUrl: string;
    t: (key: string, options?: any) => string;
    ym: (methodName: string, ...args: any[]) => void;
    setStatus: (state: string) => void;
}

export const submitPayerData = async ({
    form,
    method,
    dest,
    bfId,
    baseUrl,
    t,
    ym,
    setStatus
}: SubmitPayerDataParams): Promise<void> => {
    const ns = { ns: ["Common", "PayerData", "PayOut"] };

    let payload: any = {};
    if (method.includes("ecom")) {
        payload = {
            payment: {
                method: {
                    payer: {
                        data: {
                            card_number: form.cardNumber.replace(/\s+/g, ""),
                            card_lifetime_month: `${form.expiryDate.slice(0, 2)}`,
                            card_lifetime_year: `${form.expiryDate.slice(3)}`,
                            card_cvc: form.cvv,
                            ...(form.cardHolder.trim() && { card_holder: form.cardHolder })
                        }
                    }
                }
            }
        };
    } else {
        switch (method) {
            case "sbp":
                payload = {
                    payment: {
                        method: {
                            payer: {
                                data: {
                                    phone: form.cardNumber
                                }
                            }
                        }
                    }
                };
                break;
            case "card2card":
                payload = {
                    payment: {
                        method: {
                            payer: {
                                data: {
                                    card: form.cardNumber
                                }
                            }
                        }
                    }
                };
                break;
            default:
                return;
        }
    }

    ym("reachGoal", "main-button", { caption: t("approve", ns) });

    if (method === "ecom") {
        ym("reachGoal", "ecom-payer-data-entered");
    }

    try {
        const res = await fetch(`${baseUrl}/${dest}s/${bfId}/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                event: "paymentPayerDataEntered",
                payload
            })
        });

        const result = await res.json();

        if (!result.success) {
            if (result?.error == "8001") {
                if (result?.state) setStatus(result.state);
                return;
            } else {
                toast.error(result?.error_details ? result.error_details : result?.error, { autoClose: 2000 });
            }
        }
    } catch (error: any) {
        toast.error(error.message || "Unexpected error", {
            autoClose: 2000,
            closeButton: <></>
        });
    }
};
