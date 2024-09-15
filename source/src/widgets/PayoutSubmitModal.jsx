import { useState } from "react";
import AlertTriangleBig from "../assets/images/alert-triangle-big.svg";

const PayoutSubmitModal = ({ closeModal = () => {} }) => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <div className="overlay active" onClick={closeModal}>
            <div
                onClick={e => {
                    e.stopPropagation();
                }}
                className="dialog">
                <img src={AlertTriangleBig} alt="" />

                <div className="payout-dialog">
                    <div className="payout-dialog__block">
                        <h3 className="payout-dialog__title">Проверьте реквизиты!</h3>
                        <p className="payout-dialog__card-number">1234 1234 1234 1234</p>
                        <p className="payout-dialog__text">
                            Если вы не верно указали реквизиты, вы безвозвратно потеряте средства
                        </p>
                    </div>

                    <div className="payout-dialog__buttons-block">
                        <div className="toggle-switch" onClick={() => setIsChecked(!isChecked)}>
                            <div
                                className={`toggle-switch__slider ${
                                    isChecked ? "toggle-switch__slider--checked" : ""
                                }`}>
                                <div className="toggle-switch__thumb" />
                            </div>
                            <span className="toggle-switch__label">Реквизиты указаны верно</span>
                        </div>

                        <div className="payout-dialog__buttons-submit">
                            <button className="button main-button" disabled={!isChecked}>
                                Продолжить
                            </button>
                            <button className="button outline-button" onClick={closeModal}>
                                Исправить реквизиты
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayoutSubmitModal;
