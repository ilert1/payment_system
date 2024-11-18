import { PAGE_MAIN } from "../assets/constants.js";
import { useContext, useEffect } from "react";
import AppContext from "../AppContext";
import { useLocation } from "react-router-dom";

export default function usePaymentPage({ absolutePath = false }) {
    const { paymentEcomPage, navigate, BFData } = useContext(AppContext);

    const location = useLocation();
    const nav = navigate();

    useEffect(() => {
        const paymentPage = paymentEcomPage();
        const locationSplits = location.pathname.split("/");

        if (paymentPage) {
            if (
                locationSplits.length > 1 &&
                locationSplits.slice(0, -1).join("/") + "/" + paymentPage !== location.pathname
            ) {
                if (!location.pathname.includes(paymentPage) || paymentPage !== PAGE_MAIN) {
                    nav(absolutePath || paymentPage.includes("/") ? paymentPage : "../" + paymentPage, {
                        replace: true
                    });
                } else if (paymentPage === PAGE_MAIN && locationSplits.length > 3 && locationSplits[3]) {
                    nav("..", { replace: true });
                }
            }
        }
    }, [BFData?.payment?.status, BFData?.payout?.status]);
}
