/* eslint-disable react/prop-types */
import AlertTriangleBig from "../shared/assets/images/alert-triangle-big.svg?react";

interface SubmitModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
    data: {
        title: string;
        text: string;
        primaryBtnText: string;
        primaryBtnCallback: () => void;
        secondaryBtnText: string;
        secondaryBtnCallback: () => void;
    };
    isLoading: boolean;
}

const SubmitModal = (props: SubmitModalProps) => {
    const { show, setShow, data, isLoading } = props;

    return (
        <div className={`overlay ${show ? "active" : ""}`} onClick={() => setShow(false)}>
            <div
                onClick={e => {
                    e.stopPropagation();
                }}
                className="dialog">
                <div className="payout-dialog">
                    <div className="payout-dialog__block">
                        <AlertTriangleBig className="alert-triangle" />
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

export default SubmitModal;
