import { create } from "zustand";
import axios from "axios";
import { AppRoutes } from "@/shared/const/router";
import { YmType } from "@/AppContext";

type StatusType = string;

interface BFStore {
    blowfishId: string;
    BFData: BFDataType | null;
    status: StatusType;
    loading: boolean;
    error: boolean;

    init: (params: { id: string; payoutMode: boolean; fingerprintConfig: any; ym: YmType }) => Promise<void>;

    setStatus: (status: string) => void;
    setBfData: (data: BFDataType) => void;
}

export const useBFStore = create<BFStore>((set, get) => ({
    blowfishId: "",
    BFData: null,
    status: "",
    loading: false,
    error: false,

    init: async ({ id, payoutMode, fingerprintConfig, ym }) => {
        const baseApiURL = import.meta.env.VITE_API_URL;
        const dest = payoutMode ? "payout" : "payment";
        const nextPage = `../${AppRoutes.PAYEE_DATA_PAGE}`;
        set({ loading: true, error: false });

        try {
            const { data } = await axios.get(`${baseApiURL}/${dest}s/${id}`, fingerprintConfig);

            if (!data?.success) {
                window.location.replace(
                    `/${payoutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`
                );
                return;
            }

            //блок для быстрой подстановки нужных данных
            /* let tmpData = structuredClone(data);
            tmpData[dest].method.payee.data.bank_name = "a-mobile";
            tmpData[dest].method.name = "tsbp"; */

            set({
                BFData: data, //подставить tmpData для тестов
                status: data?.[dest]?.status,
                blowfishId: id
            });

            ym?.("reachGoal", "BFData", { BFData: data?.[dest] });

            if (data?.[dest]?.method?.name === "ecom") {
                ym?.("reachGoal", "ecom-payer-data-page");
            }
        } catch (e: any) {
            set({ error: true });
            window.location.replace(
                `/${payoutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`
            );
        } finally {
            set({ loading: false });
        }
    },

    setStatus: status => set({ status }),
    setBfData: data => set({ BFData: data })
}));
