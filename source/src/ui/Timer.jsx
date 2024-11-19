import { useEffect } from "react";
import { useTimer, useStopwatch } from "react-timer-hook";

export const Timer = ({ down = false, secondsToDo = 60, className = "", timerCallback = () => {} }) => {
    let time = new Date();

    if (!down) {
        var { minutes, seconds } = useStopwatch({ autoStart: true });
    } else {
        time.setSeconds(time.getSeconds() + secondsToDo);
        var { minutes, seconds } = useTimer({ expiryTimestamp: time, onExpire: timerCallback });
    }

    return (
        <div id="timer" className={className ? className : "timer"}>
            {`${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`}
        </div>
    );
};

export default Timer;
