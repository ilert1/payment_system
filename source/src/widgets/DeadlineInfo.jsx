import { Timer } from "../ui/Timer";
import BankLogo from "../assets/images/bank-icon.svg";
import Clock from "../assets/images/clock.svg";

export const DeadlineInfo = ({ bankName }) => {
    return (
        <div className="bank-deadline-info">
            <div className="bank-info">
                <img src={BankLogo} alt="" />
                <p className="bank-name">{bankName}</p>
            </div>
            <div className="deadline-container">
                <img src={Clock} alt="" />
                <Timer down={true} className="deadline-timer" secondsToDo={60 * 20} />
            </div>
        </div>
    );
};
