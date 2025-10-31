import { cva, VariantProps } from "class-variance-authority";
import { useTimer, useStopwatch } from "react-timer-hook";
import styles from "./Timer.module.scss";

const timerVariants = cva(styles.timer, {
    variants: {
        size: {
            md: styles.textMedium,
            lg: styles.textLarge
        },
        marginTop: {
            true: styles.marginTop
        }
    },
    defaultVariants: {
        size: "md"
    }
});

interface TimerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof timerVariants> {
    size?: VariantProps<typeof timerVariants>["size"];
    className?: string;
    down?: boolean;
    secondsToDo?: number;
    timerCallback?: () => void;
    marginTop?: boolean;
}

export const Timer = (props: TimerProps) => {
    const { down, secondsToDo, className, timerCallback, size, marginTop } = props;
    const time = new Date();

    // Always call both hooks, but only use the appropriate one
    // const stopwatchResult = useStopwatch({ autoStart: !down });

    // time.setSeconds(time.getSeconds() + (secondsToDo || 0));
    // const timerResult = useTimer({
    //     expiryTimestamp: time,
    //     onExpire: timerCallback,
    //     autoStart: false
    // });

    if (!down) {
        var { minutes, seconds } = useStopwatch({ autoStart: true });
    } else {
        time.setSeconds(time.getSeconds() + (secondsToDo || 0));
        var { minutes, seconds } = useTimer({ expiryTimestamp: time, onExpire: timerCallback });
    }

    // Use the appropriate result based on the down prop
    // const { minutes, seconds } = down ? timerResult : stopwatchResult;

    return (
        <div id="timer" className={timerVariants({ size, className, marginTop })}>
            {`${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`}
        </div>
    );
};

export default Timer;
