import { useContext, useRef, useEffect } from "react";
import AppContext from "../AppContext";

import Lock from "../assets/images/lock.svg";
import ArrowRight from "../assets/images/arrow-right.svg";
import ArrowLeft from "../assets/images/arrow-left.svg";
import Check from "../assets/images/check.svg";
import Discard from "../assets/images/discard.svg";

import BankIcon from "../assets/images/bank-icon.svg"; //Sberbank_Logo_2020.svg";

import { PayeeInfo } from "./PayeeInfo";
import { BankCardInfo } from "./BankCardInfo";

const FooterOld = ({
    buttonCaption = "",
    nextPage = "",
    //backButton = false,
    prevPage = "",
    nextEnabled = true,
    approve = false,
    focused = false,
    payeeCard = false,
    noIcon = false,
    buttonCallback = null,
    absolutePrev = false,
    discardButton = { caption: "", disabled: true, callback: () => {} },
    approveButton = { caption: "", disabled: true, callback: () => {} }
}) => {
    const navigate = useContext(AppContext).navigate();
    const { traderData, currentPaymentMethod, t, BFData } = useContext(AppContext);

    //translation
    const ns = { ns: "Footer" };

    const trader = JSON.parse(traderData);

    const mainButton = useRef();

    useEffect(() => {
        if (focused) {
            mainButton.current.focus();
        }
    }, [, focused]);

    let buttonIcon = ArrowRight;
    if (noIcon) buttonIcon = null;
    if (approve) buttonIcon = Check;

    // console.log(prevPage);

    return (
        <footer>
            <div className={`top${(prevPage || nextPage) && payeeCard ? " big-footer-container" : ""}`}>
                {prevPage || nextPage ? (
                    <div className="buttons-container">
                        {prevPage ? (
                            <button
                                id="back-button"
                                className={`button back-button${nextPage == "" ? " grow" : ""}`}
                                onClick={() => {
                                    if (absolutePrev) {
                                        window.location.replace(prevPage);
                                    } else {
                                        navigate(prevPage, { replace: true });
                                    }
                                }}>
                                <img src={ArrowLeft} alt="" />
                            </button>
                        ) : (
                            ""
                        )}

                        {nextPage ? (
                            <button
                                id="main-button"
                                ref={mainButton}
                                className={`button main-button ${!nextEnabled ? "disabled" : ""}`}
                                onClick={() => {
                                    if (buttonCallback) {
                                        buttonCallback();
                                    } else {
                                        navigate(`${nextPage}`, { replace: true });
                                    }
                                }}>
                                {buttonCaption}
                                <img src={buttonIcon} alt="" />
                            </button>
                        ) : (
                            ""
                        )}
                    </div>
                ) : (
                    ""
                )}

                {(discardButton.caption || approveButton.caption) && (
                    <div className="buttons-container">
                        {approveButton.caption && (
                            <button
                                ref={mainButton}
                                className={`button main-button main-button__approve ${
                                    approveButton.disabled ? "disabled" : ""
                                }`}
                                onClick={approveButton.callback}>
                                {approveButton.caption}
                                <img src={Check} alt="" />
                            </button>
                        )}

                        {discardButton.caption && (
                            <button
                                ref={mainButton}
                                className={`button main-button main-button__discard  ${
                                    discardButton.disabled ? "disabled" : ""
                                }`}
                                onClick={discardButton.callback}>
                                {discardButton.caption}
                                <img src={Discard} alt="" />
                            </button>
                        )}
                    </div>
                )}

                {payeeCard ? (
                    <div className="payee-data">
                        <BankCardInfo BankIcon={BankIcon} cardNumber={trader?.card ? trader?.card : trader?.phone} />
                        <PayeeInfo
                            PayeeName={trader?.cardholder ? trader?.cardholder : currentPaymentMethod?.bank_name}
                            showPayeeData={trader?.card}
                        />
                    </div>
                ) : (
                    ""
                )}
            </div>

            <div className="security-details">
                <img src={Lock} alt="" />
                <p>
                    {t("protected", ns)} <a href="#">{t("details", ns)}</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
