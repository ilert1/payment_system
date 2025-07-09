import { useBFStore } from "@/shared/store/bfDataStore";
import { getPayment } from "../services/getPayment";
import { useAppContext } from "@/AppContext";
import { create } from "zustand";
import { PaymentStore } from "../types/PayerDataPageTypes";

export const usePaymentStore = create<PaymentStore>(set => ({
    isFetching: false,
    setIsFetching: state => set({ isFetching: state }),
    fetchPaymentInit: async ({ dest, bfId, navigate, payOutMode }) => {
        const { fingerprintConfig } = useAppContext();
        const setBfData = useBFStore(state => state.setBfData);

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
