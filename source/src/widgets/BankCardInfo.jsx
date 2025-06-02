export const BankCardInfo = ({ cardNumber, BankIcon, onError }) => {
    return (
        <div className="card-info">
            <img src={BankIcon} onError={onError} alt="" />
            <p>{cardNumber}</p>
        </div>
    );
};

export default BankCardInfo;
