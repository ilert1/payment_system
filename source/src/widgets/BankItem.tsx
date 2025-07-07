import { useState } from "react";
import DefaultBankIcon from "../shared/assets/images/bank-icon.svg?react";

interface BankItemProps {
    active: boolean;
    onClick: () => void;
    bankName: string;
    bankIcon: string;
}

const BankItem = (props: BankItemProps) => {
    const { active, onClick, bankName, bankIcon } = props;
    const [isError, setIsError] = useState(false);

    return (
        <div onClick={onClick} className={`bank-item ${active ? "active" : ""}`}>
            {isError ? (
                <DefaultBankIcon />
            ) : (
                <img
                    src={bankIcon}
                    onError={e => {
                        e.preventDefault();
                        setIsError(true);
                        // e.target.src = DefaultBankIcon;
                        // e.target.classList.remove("logo");
                    }}
                />
            )}

            <p className="bank-name">{bankName}</p>
        </div>
    );
};

export default BankItem;
