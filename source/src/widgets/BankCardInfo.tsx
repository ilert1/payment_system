interface BankCardInfoProps {
    cardNumber: string;
    BankIcon: SvgComponent;
    onError: () => void;
}

export const BankCardInfo = (props: BankCardInfoProps) => {
    const { BankIcon, cardNumber, onError } = props;

    return (
        <div className="card-info">
            {/* <img src={BankIcon} onError={onError} alt="" /> */}
            <BankIcon onError={onError} />
            <p>{cardNumber}</p>
        </div>
    );
};

export default BankCardInfo;
