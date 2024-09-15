import { useEffect, useRef } from "react";
import BankIcon from "../assets/images/bank-icon.svg";

const BankItem = ({ active, onClick, bankName /* , lowLimit, highLimit */ }) => {
    //<p className="pay-limits">{`${lowLimit} - ${highLimit}`}</p>
    return (
        <div onClick={onClick} className={`bank-item ${active ? "active" : ""}`}>
            <img src={BankIcon} alt="" />
            <p className="bank-name">{bankName}</p>
            
        </div>
    );
};

export default BankItem;
