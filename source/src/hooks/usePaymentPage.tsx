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
        console.log("PAYMENT PAGE ON usePaymentPage: ", paymentPage);

        if (paymentPage) {
            console.log("Changing location");
            if (
                locationSplits.length > 1 &&
                locationSplits.slice(0, -1).join("/") + "/" + paymentPage !== location.pathname
            ) {
                if (!location.pathname.includes(paymentPage) && paymentPage !== AppRoutes.PAGE_MAIN) {
                    console.log(
                        "Navigating to: ",
                        absolutePath || paymentPage.includes("/") ? paymentPage : "../" + paymentPage
                    );
                    nav(absolutePath || paymentPage.includes("/") ? paymentPage : "../" + paymentPage, {
                        replace: true
                    });
                } else if (paymentPage === AppRoutes.PAGE_MAIN && locationSplits.length > 3 && locationSplits[3]) {
                    console.log("Navigating to: ", "..");
                    nav("..", { replace: true });
                }
            }
        }
    }, [status]);
}

// import { PAGE_MAIN } from "../assets/constants.js";
// import { useContext, useEffect } from "react";
// import AppContext from "../AppContext";
// import { useLocation } from "react-router-dom";

// export default function usePaymentPage({ absolutePath = false }) {
//     const { paymentEcomPage, navigate, status } = useContext(AppContext);

//     const location = useLocation();
//     const nav = navigate();

//     useEffect(() => {
//         const paymentPage = paymentEcomPage();
//         const locationSplits = location.pathname.split("/");

//         if (paymentPage) {
//             if (
//                 locationSplits.length > 1 &&
//                 locationSplits.slice(0, -1).join("/") + "/" + paymentPage !== location.pathname
//             ) {
//                 if (!location.pathname.includes(paymentPage) && paymentPage !== PAGE_MAIN) {
//                     nav(absolutePath || paymentPage.includes("/") ? paymentPage : "../" + paymentPage, {
//                         replace: true
//                     });
//                 } else if (paymentPage === PAGE_MAIN && locationSplits.length > 3 && locationSplits[3]) {
//                     nav("..", { replace: true });
//                 }
//             }
//         }
//     }, [status]);
// }
