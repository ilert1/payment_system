import { create } from "zustand";
import { useBFStore } from "@/shared/store/bfDataStore";
import { submitForm } from "../services/submitForm";
import { ThreeDsFormStore } from "../types/threeDSFormTypes";

export const useThreeDSFormStore = create<ThreeDsFormStore>(set => ({
    isFetching: false,
    setIsFetching: state => set({ isFetching: state }),
    submitForm: async ({ formData, fingerprintConfig }) => {
        const setStatus = useBFStore.getState().setStatus;

        const bfData = useBFStore.getState().BFData;
        const dest = Boolean(bfData?.payout) ? "payout" : "payment";

        set({ isFetching: true });

        const res = await submitForm({
            formData,
            fingerprintHeaders: fingerprintConfig,
            setStatus,
            dest,
            bfId: bfData?.[dest]?.id ?? ""
        });

        set({ isFetching: false });

        return res;
    }
}));
