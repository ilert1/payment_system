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

const StopwatchTimer = ({ className, size, marginTop }: TimerProps) => {
    const { minutes, seconds } = useStopwatch({ autoStart: true });
    return <div className={timerVariants({ size, className, marginTop })}>{`${minutes}:${seconds}`}</div>;
};

const CountdownTimer = ({ secondsToDo = 0, timerCallback, className, size, marginTop }: TimerProps) => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + secondsToDo);
    const { minutes, seconds } = useTimer({ expiryTimestamp: time, onExpire: timerCallback });
    return <div className={timerVariants({ size, className, marginTop })}>{`${minutes}:${seconds}`}</div>;
};

export const Timer = (props: TimerProps) => {
    return props.down ? <CountdownTimer {...props} /> : <StopwatchTimer {...props} />;
};

export default Timer;
