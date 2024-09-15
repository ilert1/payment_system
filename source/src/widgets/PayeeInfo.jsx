import { useState, useEffect, useContext } from "react";
import AppContext from "../AppContext";

import UserIcon from "../assets/images/user.svg";
import PayeeHint from "../ui/PayeeHint";

export const PayeeInfo = ({ PayeeName, showPayeeData }) => {
    const [showPopup, setShowPopup] = useState(false);

    const { t } = useContext(AppContext);
    //translation
    const ns = { ns: "PayeeInfo" };

    let popupTimeout = null;

    const showPopupCallback = e => {
        e.preventDefault();
        clearTimeout(popupTimeout);

        setShowPopup(!showPopup);
    };

    useEffect(() => {
        if (showPopup) {
            popupTimeout = setTimeout(() => {
                setShowPopup(false);
            }, 3000);
        }
        return () => {
            clearTimeout(popupTimeout);
        };
    }, [showPopup]);

    return (
        <div className="payee-info-container">
            <img src={UserIcon} alt="" />
            <p className="payee-name">{PayeeName}</p>
            {showPayeeData ? (
                <div className="payee-container">
                    <a href="" onClick={showPopupCallback}>
                        {t("payeeInfo", ns)}
                    </a>
                    <PayeeHint showPopup={showPopup} payeeData={PayeeName} />
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

export default PayeeInfo;
