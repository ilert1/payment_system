// import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
import Footer from "../widgets/Footer";
// import SupportDialog from "../widgets/SupportDialog";
// import Rating from "../widgets/Rating";

// import { useLocation } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../AppContext";

const SuccessPage = () => {
    const { BFData, resetStorage, t, getCurrencySymbol, payoutMode } = useContext(AppContext);

    //translation
    const ns = { ns: "Success" };

    // const location = useLocation();
    // const [rate, setRate] = useState(0);

    /* <Rating rate={rate} setRate={setRate} />

    <div className="feedback-container">
        <p>Напишите отзыв, если есть чем поделиться</p>
        <textarea id="feedback-text" placeholder="Отзыв"></textarea>
    </div>


    */
    resetStorage();

    return (
        <div className="container">
            <Header />

            <div className="content">
                <div className="header-container grow wide center">
                    <h1>{t(payoutMode ? "payoutHeader" : "header", ns)}</h1>
                    {BFData.status && BFData?.status === "payoutPartiallyExecuted" ? (
                        <>
                            <p className="amount">
                                + {BFData?.lots.reduce((accum, curVal) => accum + Number(curVal.amount), 0)}{" "}
                                {getCurrencySymbol(BFData?.currency)}
                            </p>
                            <div className="instructions small">
                                <ul>
                                    <li>
                                        Не выплаченная часть будет возвращена на ваш счет, либо повторите попытку позже.
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <p className="amount">
                            + {BFData?.amount} {getCurrencySymbol(BFData?.currency)}
                        </p>
                    )}
                </div>
            </div>

            {BFData?.success_url && <Footer prevPage={BFData?.success_url} absolutePrev={true} />}
        </div>
    );
};

export default SuccessPage;
