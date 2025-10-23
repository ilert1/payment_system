import { Suspense, useEffect } from "react";
import { useAppContext } from "@/AppContext";
// import "@/shared/assets/css/fonts.css";
// import "@/shared/assets/css/styles.css";
import { useBFStore } from "@/shared/store/bfDataStore";
import { CustomToastContainer } from "@/shared/ui/CustomToastContainer";
import Loader from "@/shared/ui/Loader/Loader";
import { Content } from "@/widgets/Content";
import { Page } from "@/widgets/Page";
import { AppRouter } from "./providers/router";

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

            es.onopen = () => {
                console.log(">>> Connection opened!");
                ym("reachGoal", "sse-ok");
            };

            es.onerror = e => {
                console.error("ERROR!", e);
                ym("reachGoal", "sse-error", { error: e });
            };

            es.onmessage = async e => {
                try {
                    const resEventData = JSON.parse(e.data);
                    console.log("SSE: ", resEventData);
                    if (resEventData.data.status) {
                        ym("reachGoal", "status-sse", { status: resEventData.data.status });
                    }
                    setStatus(resEventData.data.status);
                } catch (error) {}
            };

            // return () => es.close();
        }
    }, [BFData?.[dest]?.id]);

    return (
        <>
            {loading ? (
                <Page header={false}>
                    <Content>
                        <Loader />
                    </Content>
                </Page>
            ) : (
                <Suspense fallback={<div>Загрузка переводов...</div>}>
                    <AppRouter />
                </Suspense>
            )}
            <CustomToastContainer />
        </>
    );
};

export default App;
