import { PAGE_MAIN } from "../shared/assets/constants.js";
import { useEffect } from "react";
import { useAppContext } from "../AppContext.js";
import { useLocation, useNavigate } from "react-router-dom";

export default function usePaymentPage({ absolutePath = false }) {
    const { paymentEcomPage, status } = useAppContext();

    const location = useLocation();
    const nav = useNavigate();

    useEffect(() => {
        const paymentPage = paymentEcomPage();
        const locationSplits = location.pathname.split("/");

        if (paymentPage) {
            console.log("Changing location");
            if (
                locationSplits.length > 1 &&
                locationSplits.slice(0, -1).join("/") + "/" + paymentPage !== location.pathname
            ) {
                if (!location.pathname.includes(paymentPage) && paymentPage !== PAGE_MAIN) {
                    nav(absolutePath || paymentPage.includes("/") ? paymentPage : "../" + paymentPage, {
                        replace: true
                    });
                } else if (paymentPage === PAGE_MAIN && locationSplits.length > 3 && locationSplits[3]) {
                    nav("..", { replace: true });
                }
            }
        }
    }, [status]);
}
