/* eslint-disable react/prop-types */
import AlertTriangleBig from "../assets/images/alert-triangle-big.svg";

const PaymentSubmitModal = ({
    show = false,
    setShow = () => {},
    data = {
        title: "",
        text: "",
        primaryBtnText: "",
        primaryBtnCallback: () => {},
        secondaryBtnText: "",
        secondaryBtnCallback: () => {}
    },
    isLoading = false
}) => {
    return (
        <div className={`overlay ${show ? "active" : ""}`} onClick={() => setShow(false)}>
            <div
                onClick={e => {
                    e.stopPropagation();
                }}
                className="dialog">
                <div className="payout-dialog">
                    <div className="payout-dialog__block">
                        <img className="alert-triangle" src={AlertTriangleBig} alt="" />
                        <h3 className="payout-dialog__title">{data.title}</h3>
                        <p className="payout-dialog__text">{data.text}</p>
                    </div>

                    <div className="payout-dialog__buttons-block">
                        <div className="payout-dialog__buttons-submit">
                            <button
                                onClick={data.primaryBtnCallback}
                                className={"button cancel-button " + (isLoading ? "cancel-button__loading" : "")}
                                disabled={false}>
                                {!isLoading && data.primaryBtnText}&nbsp;
                            </button>
                            <button
                                className="button outline-button"
                                onClick={data.secondaryBtnCallback}
                                disabled={isLoading}>
                                {data.secondaryBtnText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSubmitModal;
