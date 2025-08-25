import { useAppContext } from "@/AppContext";
import ArrowDown from "@/shared/assets/images/chevron-down.svg";
import { classNames } from "@/shared/lib/classNames";
import { Button } from "@/shared/ui/Button/Button";
import styles from "./Instruction.module.scss";
import { InstructionItems } from "./InstructionItems";

interface InstructionProps {
    title: string;
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

    return (
        <div className={classNames(styles.accordionContainer, { [styles.active]: active == i })}>
            <div className={styles.title}>
                <p className={styles.p} onClick={callback}>
                    {title}
                </p>

                <Button onClick={callback} variant="ghost" className={styles.btn}>
                    <img className={styles.arrow} src={ArrowDown} alt="" />
                </Button>
            </div>
            {children ? children : <InstructionItems start={start} data={data ?? ""} />}
        </div>
    );
};
