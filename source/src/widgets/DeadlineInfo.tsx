import { Timer } from "../shared/ui/Timer";
// import BankLogo from "../assets/images/bank-icon.svg";
// import Clock from "../assets/images/clock.svg";
import BankLogo from "@/shared/assets/images/bank-icon.svg?react";
import ClockLogo from "@/shared/assets/images/clock.svg?react";

interface DeadlineInfoProps {
    bankName: string;
}

export const DeadlineInfo = (props: DeadlineInfoProps) => {
    const { bankName } = props;

    return (
        <div className="bank-deadline-info">
            <div className="bank-info">
                {/* <img src={BankLogo} alt="" /> */}
                <BankLogo />
                <p className="bank-name">{bankName}</p>
            </div>
            <div className="deadline-container">
                {/* <img src={Clock} alt="" /> */}
                <ClockLogo />
                <Timer down={true} className="deadline-timer" secondsToDo={60 * 15} />
            </div>
        </div>
    );
};
