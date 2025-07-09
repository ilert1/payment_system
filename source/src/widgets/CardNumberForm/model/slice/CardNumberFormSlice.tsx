import { create } from "zustand";
import { useAppContext, YmType } from "@/AppContext";
import { useBFStore } from "@/shared/store/bfDataStore";
import { submitPayerData } from "../services/SubmitPayerData";

const baseUrl = import.meta.env.VITE_API_URL;

type PayerPayload = {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolder: string;
    dest: "payout" | "payment";
};

type PayerDataStore = {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolder: string;
    setCardNumber: (value: string) => void;
    setExpiryDate: (value: string) => void;
    setCvv: (value: string) => void;
    setCardHolder: (value: string) => void;
    submitPayerData: (
        data: PayerPayload,
        method: string,
        dest: "payout" | "payment",
        ym: YmType,
        t: any
    ) => Promise<void>;
};

export const usePayerDataStore = create<PayerDataStore>(set => ({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: "",

    setCardNumber: value => set({ cardNumber: value }),
    setExpiryDate: value => set({ expiryDate: value }),
    setCvv: value => set({ cvv: value }),
    setCardHolder: value => set({ cardHolder: value }),

    submitPayerData: async (form, method, dest, ym, t) => {
        const BFData = useBFStore.getState().BFData;
        const bfId = BFData?.[dest]?.id;

        if (!bfId) return;

        await submitPayerData({
            form,
            method,
            dest,
            bfId,
            baseUrl,
            t,
            ym
        });
    }
}));
