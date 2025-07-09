import { create } from "zustand";
import { useAppContext } from "@/AppContext";
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
    submitPayerData: (data: PayerPayload, method: string, dest: "payout" | "payment") => Promise<void>;
};

export const usePayerDataStore = create<PayerDataStore>(() => ({
    submitPayerData: async (form, method, dest) => {
        const { ym, t } = useAppContext();
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
