import Clock from "@/shared/assets/images/clock.svg?react";
import ClockOrange from "@/shared/assets/images/clock_orange.svg?react";
import { classNames } from "@/shared/lib/classNames";
import Timer from "@/shared/ui/Timer/Timer";
import styles from "./DeadLineTimer.module.scss";

interface DeadLineTimerProps {
    timerSecondsTo: number;
    timerCallback: () => void;
    orange?: boolean;
}

export const DeadLineTimer = ({ timerSecondsTo, timerCallback, orange = true }: DeadLineTimerProps) => {
    return (
        <div className={classNames(styles.deadlineContainer, { [styles.orange]: orange })}>
            {orange ? <ClockOrange className={styles.img} /> : <Clock className={styles.imgGray} />}
            <Timer
                down={true}
                className={styles.deadlineTimer}
                secondsToDo={timerSecondsTo}
                timerCallback={timerCallback}
            />
        </div>
    );
};
