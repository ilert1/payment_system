interface BankCardInfoProps {
    cardNumber: string;
    bankIcon: string;
    onError: (e: any) => void;
}

export const BankCardInfo = (props: BankCardInfoProps) => {
    const { bankIcon, cardNumber, onError } = props;

    return (
        <div className="card-info">
            <img src={bankIcon} onError={onError} alt="" />
            <p>{cardNumber}</p>
        </div>
    );
};

export default BankCardInfo;
