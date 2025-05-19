import DefaultBankIcon from "../assets/images/bank-icon.svg";

const BankItem = ({ active, onClick, bankName, bankIcon }) => {
    return (
        <div onClick={onClick} className={`bank-item ${active ? "active" : ""}`}>
            <img
                src={bankIcon}
                alt=""
                onError={e => {
                    e.target.src = DefaultBankIcon;
                    // e.target.classList.remove("logo");
                }}
            />

            <p className="bank-name">{bankName}</p>
        </div>
    );
};

export default BankItem;
