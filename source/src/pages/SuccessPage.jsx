// import * as c from "../assets/constants.js";
import Header from "../widgets/Header";
// import Footer from "../widgets/Footer";
// import SupportDialog from "../widgets/SupportDialog";
// import Rating from "../widgets/Rating";

// import { useLocation } from "react-router-dom";
import { useContext } from "react";
import AppContext from "../AppContext";

const SuccessPage = () => {
    const { BFData, resetCookies, t, getCurrencySymbol } = useContext(AppContext);

    //translation
    const ns = { ns: "Success" };

    // const location = useLocation();
    // const [rate, setRate] = useState(0);

    /* <Rating rate={rate} setRate={setRate} />

    <div className="feedback-container">
        <p>Напишите отзыв, если есть чем поделиться</p>
        <textarea id="feedback-text" placeholder="Отзыв"></textarea>
    </div> 
    
    <Footer nextPage={c.PAGE_PAYMENT_INSTRUMENT} nextEnabled={rate} />
    */
    resetCookies();

    return (
        <div className="container">
            <Header />

            <div className="content">
                <div className="header-container grow wide center">
                    <h1>{t("header", ns)}</h1>
                    <p className="amount">
                        + {BFData?.amount} {getCurrencySymbol(BFData?.currency)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
