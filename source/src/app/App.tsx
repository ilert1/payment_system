import "@/shared/assets/css/fonts.css";
import "@/shared/assets/css/styles.css";

import { useEffect } from "react";
import { useAppContext } from "@/AppContext";
import Loader from "@/shared/ui/Loader";
import { ToastContainer } from "react-toastify";
import { AppRouter } from "./providers/router";
import { AppRoutes } from "@/shared/const/router";
import { useBFStore } from "@/shared/store/bfDataStore";

const App = () => {
    const { init, loading } = useBFStore();
    const { fingerprintConfig, payoutMode, ym } = useAppContext();

    useEffect(() => {
        const pathname = new URL(window.location.href).pathname;
        const blowfishId = pathname.split("/")[2];
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        if (uuidRegex.test(blowfishId)) {
            init({ id: blowfishId, payoutMode, fingerprintConfig, ym });
        } else {
            window.location.replace(
                `/${payoutMode ? AppRoutes.PAGE_PAYOUT_NOT_FOUND : AppRoutes.PAGE_PAYMENT_NOT_FOUND}`
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                <AppRouter />
            )}
            <ToastContainer />
        </>
    );
};

export default App;
