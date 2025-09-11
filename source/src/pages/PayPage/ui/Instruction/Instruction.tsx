import { useAppContext } from "@/AppContext";
import ArrowDown from "@/shared/assets/images/chevron-down.svg";
import { classNames } from "@/shared/lib/classNames";
import { Button } from "@/shared/ui/Button/Button";
import { Text } from "@/shared/ui/Text/Text";
import styles from "./Instruction.module.scss";
import { InstructionItems } from "./InstructionItems";

interface InstructionProps {
    title?: string;
    data?: string;
    start?: number;
    i: number;
    active: number | null;
    setActive?: (i: number | null) => void;
    children?: React.ReactNode;
}

export const Instruction = (props: InstructionProps) => {
    const { title, data, start = 2, i, active = null, setActive = () => {}, children } = props;

    const { ym } = useAppContext();

    const callback = () => {
        if (active == i) setActive(null);
        else setActive(i);
        ym("reachGoal", "instruction-button", { title: title });
    };

    const isActive = active === i;

    return (
        <div className={classNames(styles.accordionContainer, { [styles.pActive]: isActive })}>
            <div className={styles.title}>
                <Text
                    className={styles.p}
                    onClick={callback}
                    variant={isActive ? "primary" : "textBody"}
                    size="2xs"
                    text={title}
                />
                <Button onClick={callback} variant="ghost" className={styles.btn}>
                    <img
                        className={classNames(styles.arrow, { [styles.arrowActive]: isActive })}
                        src={ArrowDown}
                        alt=""
                    />
                </Button>
            </div>
            {children ? children : <InstructionItems start={start} data={data ?? ""} isActive={isActive} />}
        </div>
    );
};
