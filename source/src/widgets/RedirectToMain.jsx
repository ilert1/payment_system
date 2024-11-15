import { useContext, useEffect } from "react";
import AppContext from "../AppContext";

export const useUrlInfoCheck = () => {
    const {
        urlData,
        setUrlData,
        navigate,
        storedUrlData,
        setStoredUrlData,
        setCurrentPaymentMethod,
        storedCurrentPaymentMethod
        /* clearData,
        setClearData */
    } = useContext(AppContext);
    const nav = navigate();

    useEffect(() => {
        if (!urlData) {
            if (!storedUrlData) {
                nav("/", { replace: true });
            } else {
                // console.log(JSON.parse(storedUrlData));
                setUrlData(JSON.parse(storedUrlData));
                // console.log(JSON.parse(storedCurrentPaymentMethod));
                setCurrentPaymentMethod(JSON.parse(storedCurrentPaymentMethod));
            }
        } else {
            if (!storedUrlData) {
                console.log(urlData);
            }
        }
    }, []);
};
