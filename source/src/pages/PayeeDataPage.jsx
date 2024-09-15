import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";

import { useContext, useState } from "react";
import AppContext from "../AppContext";
import { CardNumberLast4 } from "../widgets/CardNumberLast4";
import { Loader } from "../ui/Loader";
import { Timer } from "../ui/Timer";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const PayeeDataPage = () => {
    const { BFData, navigate, resetCookies, fingerprintConfig, fingerprintReady, t, getCurrencySymbol } =
        useContext(AppContext);

    //translation
    const ns = { ns: "PayeeData" };

    // const [isComplete, setIsComplete] = useState(false);
    // const [buttonFocused, setButtonFocused] = useState(false);

    const nav = navigate();

    const { data: data_OrderStatus, isFetching: isFetching_OrderStatus } = useQuery({
        queryKey: ["getOrderStatus"],
        enabled: fingerprintReady,
        // enabled: enable_getOrderStatus,
        /* refetchInterval: 1000,
        refetchIntervalInBackground: true, */
        retry: false,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            console.log("getOrderStatus ");
            let payload = BFData;
            const { trn } = payload;
            payload = {
                trn: trn
            };

            console.log("getOrderStatus payload:");
            console.log(payload);

            /* const { data } = await axios
                .post(`${import.meta.env.VITE_API_URL}/getOrderStatus`, payload, fingerprintConfig)
                .catch(e => {
                    console.log(e);
                }); */

            //response mock
            const data = {
                success: true,
                data: {
                    state: 5
                }
            };

            console.log("getOrderStatus response:");
            console.log(data);

            if (data) {
                if (data?.success) {
                    if (data?.data?.state == 5) {
                        if (BFData?.success_url) {
                            resetCookies();
                            // document.location.href = BFData.success_url;
                            window.location.replace(BFData.success_url);
                        } else {
                            nav("../" + c.PAGE_SUCCESS, { replace: true });
                        }
                    }
                    if (data?.data?.state == 6) {
                        if (BFData?.fail_url) {
                            // document.location.href = BFData.fail_url;
                            window.location.replace(BFData.fail_url);
                        } else {
                            nav("../" + c.PAGE_PAY_ERROR, { replace: true });
                        }
                    }
                } else {
                    if (BFData?.fail_url) {
                        window.location.replace(BFData.fail_url);
                    } else {
                        nav("../" + c.PAGE_GENERAL_ERROR, { replace: true });
                    }
                }
            }
            return data;
        }
    });

    return (
        <div className="container">
            <Header />

            <div className="content">
                <div className="header-container grow">
                    <h1>
                        {t("waitConfirmation", ns)} {BFData?.amount}&nbsp;
                        {getCurrencySymbol(BFData?.currency)}
                    </h1>
                </div>
                <div className="description low-mb low-mt">
                    <p>{t("waitComment", ns)}</p>
                </div>
                <div className="loader-container">
                    <Loader />
                    <Timer />
                    <p className="status-comment">{t("waitTime", ns)}</p>
                </div>
            </div>

            <Footer payeeCard={true} />
        </div>
    );
};

export default PayeeDataPage;
