export const BankCardInfo = ({ cardNumber, BankIcon }) => {
    return (
        <div className="card-info">
            <img src={BankIcon} alt="" />
            <p>{cardNumber}</p>
        </div>
    );
};

export default BankCardInfo;
