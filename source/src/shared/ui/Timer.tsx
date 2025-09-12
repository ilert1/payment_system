import { useTimer, useStopwatch } from "react-timer-hook";

interface TimeProps {
    down?: boolean;
    secondsToDo?: number;
    className?: string;
    timerCallback?: () => void;
}

export const Timer = (props: TimeProps) => {
    const { down, secondsToDo, className, timerCallback } = props;
    let time = new Date();

    if (!down) {
        var { minutes, seconds } = useStopwatch({ autoStart: true });
    } else {
        time.setSeconds(time.getSeconds() + (secondsToDo || 0));
        var { minutes, seconds } = useTimer({ expiryTimestamp: time, onExpire: timerCallback });
    }

    return (
        <div id="timer" className={className ? className : "timer"}>
            {`${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`}
        </div>
    );
};

export default Timer;
