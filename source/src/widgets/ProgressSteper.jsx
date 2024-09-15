import { useState, useEffect, useContext } from "react";
import AppContext from "../AppContext";

import { Timer } from "../ui/Timer";

export const ProgressSteper = ({ step }) => {
    const [statusText, setStatusText] = useState();

    const { t } = useContext(AppContext);
    //translation
    const ns = { ns: "ProgressSteper" };

    useEffect(() => {
        switch (step) {
            case 1:
                setStatusText(t("step1", ns));
                break;

            case 2:
                setStatusText(t("step2", ns));
                break;

            case 3:
                setStatusText(t("step3", ns));
                break;

            default:
                break;
        }
    }, [, step]);

    return (
        <div className="progress-container">
            <div className="progress-steps">
                <div className={`step ${step >= 1 ? " active" : ""}`}>1</div>
                <div className={`step ${step >= 2 ? " active" : ""}`}>2</div>
                <div className={`step ${step >= 3 ? " active" : ""}`}>3</div>
            </div>
            <div className="status">
                <div className="top">
                    <Timer />
                    <p id="status-text" className="status-text">
                        {statusText}
                    </p>
                </div>
                <p className="status-comment">{t("comment", ns)}</p>
            </div>
        </div>
    );
};

export default ProgressSteper;
