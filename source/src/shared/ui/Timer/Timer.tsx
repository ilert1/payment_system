import { useTimer, useStopwatch } from "react-timer-hook";
import { classNames } from "@/shared/lib/classNames";
import styles from "./Timer.module.scss";

interface TimeProps {
    down?: boolean;
    secondsToDo?: number;
    className?: string;
    timerCallback?: () => void;
}

export const Timer = (props: TimeProps) => {
    const { down, secondsToDo, className, timerCallback } = props;
    const time = new Date();

    // Always call both hooks, but only use the appropriate one
    const stopwatchResult = useStopwatch({ autoStart: !down });
    time.setSeconds(time.getSeconds() + (secondsToDo || 0));
    const timerResult = useTimer({
        expiryTimestamp: time,
        onExpire: timerCallback,
        autoStart: false
    });

    // Use the appropriate result based on the down prop
    const { minutes, seconds } = down ? timerResult : stopwatchResult;

    return (
        <div id="timer" className={classNames(styles.timer, {}, [className])}>
            {`${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`}
        </div>
    );
};

export default Timer;
