import { create } from "zustand";
import { useAppContext } from "@/AppContext";
import { useBFStore } from "@/shared/store/bfDataStore";
import { submitForm } from "../services/submitForm";
import { ThreeDsFormStore } from "../types/threeDSFormTypes";

export const useThreeDSFormStore = create<ThreeDsFormStore>(set => ({
    isFetching: false,
    setIsFetching: state => set({ isFetching: state }),
    submitForm: async ({ formData, navigate, fingerprintConfig }) => {
        const setStatus = useBFStore.getState().setStatus;

        const bfData = useBFStore.getState().BFData;
        const payOutMode = Boolean(bfData?.payout);
        const dest = payOutMode ? "payout" : "payment";

        set({ isFetching: true });

        console.log("Submitting");

        const res = await submitForm({
            formData,
            fingerprintHeaders: fingerprintConfig,
            setStatus,
            dest,
            bfId: bfData?.[dest]?.id ?? "",
            navigate,
            payOutMode
        });

        set({ isFetching: false });

        return res;
    }
}));
