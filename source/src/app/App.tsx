import "@/shared/assets/css/fonts.css";
import "@/assets/css/styles.css";

import { Suspense, useEffect } from "react";
import { useAppContext } from "@/AppContext";
import Loader from "@/shared/ui/Loader";
import { ToastContainer } from "react-toastify";
import { AppRouter } from "./providers/router";
import { useBFStore } from "@/shared/store/bfDataStore";
import { AppRoutes, getRoutePaymentNotFound, getRoutePayoutNotFound } from "@/shared/const/router";
const baseApiURL = import.meta.env.VITE_API_URL;

const App = () => {
    const { ym } = useAppContext();

    const { loading, BFData, setStatus } = useBFStore();
    const pathname = new URL(window.location.href).pathname;
    const dest = pathname.split("/")[1] === "payouts" ? "payout" : "payment";

    useEffect(() => {
        if (BFData?.[dest]?.id) {
            // отправляем данные в ym об ордере
            ym("reachGoal", "BFData", { BFData: BFData?.[dest] });

            // подключаем SSE
            const es = new EventSource(`${baseApiURL}/${dest}s/${BFData?.[dest]?.id}/events`);

            es.onopen = () => console.log(">>> Connection opened!");

            es.onerror = e => console.log("ERROR!", e);

            es.onmessage = async e => {
                try {
                    const resEventData = JSON.parse(e.data);
                    console.log("SSE: ", resEventData);

                    setStatus(resEventData.data.status);
                } catch (error) {}
            };

            return () => es.close();
        }
    }, [BFData?.[dest]?.id]);

    return (
        <>
            {loading ? (
                <div className="container">
                    <div className="content">
                        <div className="loader-container">
                            <Loader />
                        </div>
                    </div>
                </div>
            ) : (
                <Suspense fallback={<div>Загрузка переводов...</div>}>
                    <AppRouter />
                </Suspense>
            )}
            <ToastContainer />
        </>
    );
};

export default App;
