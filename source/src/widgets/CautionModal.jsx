/* eslint-disable react/prop-types */
import AlertTriangleBig from "../assets/images/alert-triangle-big.svg";

const CautionModal = ({
    show = false,
    setShow = () => {},
    data = {
        title: "",
        buttonText: "",
        buttonCallback: () => {}
    }
}) => {
    return (
        <div className={`overlay ${show ? "active" : ""}`} onClick={() => setShow(false)}>
            <div
                onClick={e => {
                    e.stopPropagation();
                }}
                className="dialog sm-h">
                <div className="caution-dialog">
                    <div className="caution-dialog__block">
                        <img className="alert-triangle" src={AlertTriangleBig} alt="" />
                        <h3 className="caution-dialog__title">{data.title}</h3>
                        {/* <p className="payout-dialog__text">{data.text}</p> */}
                    </div>

                    <div className="caution-dialog__buttons-block">
                        <div className="caution-dialog__buttons-submit">
                            <button onClick={data.buttonCallback} className={"button main-button"} disabled={false}>
                                {data.buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CautionModal;
