import { create } from "zustand";
import { useBFStore } from "@/shared/store/bfDataStore";
import { startPayment } from "../services/startPayment";
import { PaymentStartStore } from "../types/paymentStartTypes";

export const usePaymentStartStore = create<PaymentStartStore>(set => ({
    isFetching: false,
    setIsFetching: state => set({ isFetching: state }),

    startPayment: async ({ fingerprintHeaders }) => {
        const setStatus = useBFStore.getState().setStatus;

        const bfData = useBFStore.getState().BFData;
        const dest = Boolean(bfData?.payout) ? "payout" : "payment";

        set({ isFetching: true });

        const res = await startPayment({
            fingerprintHeaders,
            setStatus,
            dest,
            bfId: bfData?.[dest]?.id ?? ""
        });

        set({ isFetching: false });

        return res;
    }
}));
