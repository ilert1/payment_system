import { useBFStore } from "@/shared/store/bfDataStore";
import { useAppContext } from "@/AppContext";
import { create } from "zustand";
import { submitForm } from "../services/submitForm";
import { ThreeDsFormStore } from "../types/threeDSFormTypes";

export const useThreeDSFormStore = create<ThreeDsFormStore>(set => ({
    isFetching: false,
    setIsFetching: state => set({ isFetching: state }),
    submitForm: async ({ formData, navigate, fingerprintConfig }) => {
        const setBfData = useBFStore.getState().setBfData;

        const bfData = useBFStore.getState().BFData;
        const payOutMode = Boolean(bfData?.payout);
        const dest = payOutMode ? "payout" : "payment";

        set({ isFetching: true });

        const res = await submitForm({
            formData,
            fingerprintHeaders: fingerprintConfig,
            setBfData,
            dest,
            bfId: bfData?.[dest]?.id ?? "",
            navigate,
            payOutMode
        });

        set({ isFetching: false });

        return res;
    }
}));
