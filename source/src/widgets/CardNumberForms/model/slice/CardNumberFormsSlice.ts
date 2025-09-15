import { create } from "zustand";
import { useBFStore } from "@/shared/store/bfDataStore";
import { getPayment } from "../services/getPayment";
import { CardNumberFormsStore } from "../types/CardNumberFormsTypes";

export const useCardNumberFormsStore = create<CardNumberFormsStore>(set => ({
    isFetching: false,
    setIsFetching: state => set({ isFetching: state }),

    fetchPaymentInit: async ({ dest, bfId, navigate, payOutMode, fingerprintConfig }) => {
        const setBfData = useBFStore.getState().setBfData;

        set({ isFetching: true });

        const data = await getPayment({
            bfId,
            dest,
            fingerprintHeaders: fingerprintConfig.headers,
            payOutMode,
            setBfData,
            navigate
        });

        set({ isFetching: false });

        return data;
    }
}));
