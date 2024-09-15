import { useState } from "react";
import AlertTriangleBig from "../assets/images/alert-triangle-big.svg";

const PayoutSubmitModal = ({
  data = {
    title: "",
    text: "",
    cardNumber: "",
    toggleText: "",
    primaryBtnText: "",
    primaryBtnCallback: () => {},
    secondaryBtnText: "",
  },
  closeModal = () => {},
}) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="overlay active" onClick={closeModal}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="dialog"
      >
        <img src={AlertTriangleBig} alt="" />

        <div className="payout-dialog">
          <div className="payout-dialog__block">
            <h3 className="payout-dialog__title">{data.title}</h3>
            {data.cardNumber && (
              <p className="payout-dialog__card-number">{data.cardNumber}</p>
            )}
            <p className="payout-dialog__text">{data.text}</p>
          </div>

          <div className="payout-dialog__buttons-block">
            <div
              className="toggle-switch"
              onClick={() => setIsChecked(!isChecked)}
            >
              <div
                className={`toggle-switch__slider ${
                  isChecked ? "toggle-switch__slider--checked" : ""
                }`}
              >
                <div className="toggle-switch__thumb" />
              </div>
              <span className="toggle-switch__label">{data.toggleText}</span>
            </div>

            <div className="payout-dialog__buttons-submit">
              <button
                onClick={data.primaryBtnCallback}
                className="button main-button"
                disabled={!isChecked}
              >
                {data.primaryBtnText}
              </button>
              <button className="button outline-button" onClick={closeModal}>
                {data.secondaryBtnText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutSubmitModal;
