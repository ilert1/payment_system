import { useEffect } from "react";
import { useAppContext } from "../AppContext.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useBFStore } from "@/shared/store/bfDataStore.js";
import { AppRoutes } from "@/shared/const/router.js";

export default function usePaymentPage({ absolutePath = false }) {
    const { paymentEcomPage } = useAppContext();

    const { status } = useBFStore();
    const location = useLocation();
    const nav = useNavigate();

    useEffect(() => {
        const paymentPage = paymentEcomPage();
        const locationSplits = location.pathname.split("/");

        if (paymentPage) {
            if (
                locationSplits.length > 1 &&
                locationSplits.slice(0, -1).join("/") + "/" + paymentPage !== location.pathname
            ) {
                if (!location.pathname.includes(paymentPage) && paymentPage !== AppRoutes.PAGE_MAIN) {
                    nav(absolutePath || paymentPage.includes("/") ? paymentPage : "../" + paymentPage, {
                        replace: true
                    });
                } else if (paymentPage === AppRoutes.PAGE_MAIN && locationSplits.length > 3 && locationSplits[3]) {
                    nav("..", { replace: true });
                }
            }
        }
    }, [status]);
}
