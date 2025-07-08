import { create } from "zustand";
import axios from "axios";
import { AppRoutes } from "@/shared/const/router";

type StatusType = string;

interface BFStore {
    blowfishId: string;
    BFData: BFDataType | null;
    status: StatusType;
    loading: boolean;
    error: boolean;

    init: (params: {
        id: string;
        payoutMode: boolean;
        fingerprintConfig: any;
        ym: (...args: any[]) => void;
    }) => Promise<void>;

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

        set({ loading: true, error: false });

        try {
            const { data } = await axios.get(`${baseApiURL}/${dest}s/${id}`, fingerprintConfig);

            if (!data?.success) {
                window.location.replace(
                    `/${payoutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`
                );
                return;
            }

            set({ BFData: data, status: data?.[dest]?.status, blowfishId: id });

            ym("reachGoal", "BFData", { BFData: data?.[dest] });

            if (data?.[dest]?.method?.name === "ecom") {
                ym("reachGoal", "ecom-payer-data-page");
            }

            // Подключаем SSE
            const es = new EventSource(`${baseApiURL}/${dest}s/${data?.[dest]?.id}/events`);
            es.onopen = () => console.log(">>> Connection opened!");
            es.onerror = e => console.error("SSE error:", e);
            es.onmessage = e => {
                try {
                    const eventData = JSON.parse(e.data);
                    set({ status: eventData.data.status });
                } catch {}
            };

            window.addEventListener("beforeunload", () => es.close());
        } catch (e: any) {
            console.error(e);
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
