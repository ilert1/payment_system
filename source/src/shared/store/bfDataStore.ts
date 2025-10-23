import axios from "axios";
import { create } from "zustand";
import { YmType } from "@/AppContext";
import { AppRoutes } from "../const/router";

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

export const useBFStore = create<BFStore>(set => ({
    blowfishId: "",
    BFData: null,
    status: "",
    loading: false,
    error: false,

    init: async ({ id, payoutMode, fingerprintConfig, ym }) => {
        const baseApiURL = import.meta.env.VITE_API_URL;
        const dest = payoutMode ? "payout" : "payment";
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
            tmpData[dest].method.name = "bank_account_number";
            tmpData[dest].currency = "ARS";
            tmpData[dest].method.payee.data.bank_name = "bru";
            tmpData[dest].method.payee.data.card_holder = "Sofía Martínez";
            tmpData[dest].method.bank.display_name.name_en = "Brubank S.A.";
            tmpData[dest].method.bank.display_name.name_ru = "Brubank S.A.";
            tmpData[dest].method.payee.data.account_number = "0000147800000067840056";
            tmpData[dest].method.payee.data.card_number = null; */

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
