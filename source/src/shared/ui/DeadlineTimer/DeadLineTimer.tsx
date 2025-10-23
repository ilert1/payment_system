import Clock from "@/shared/assets/images/clock.svg?react";
import Timer from "@/shared/ui/Timer/Timer";
import styles from "./DeadLineTimer.module.scss";

interface DeadLineTimerProps {
    timerSecondsTo: number;
    timerCallback: () => void;
}
export const DeadLineTimer = ({ timerSecondsTo, timerCallback }: DeadLineTimerProps) => {
    return (
        <div className={styles.deadlineContainer}>
            <Clock className={styles.img} />
            <Timer
                down={true}
                className={styles.deadlineTimer}
                secondsToDo={timerSecondsTo}
                timerCallback={timerCallback}
            />
        </div>
    );
};
