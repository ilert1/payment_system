import { useAppContext } from "@/AppContext";
import { InstructionItems } from "./InstructionItems";
import ArrowDown from "@/shared/assets/images/chevron-down.svg";

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
        <div className={`accordion-container ${active == i ? "active" : ""}`}>
            <div className="title">
                <p onClick={callback}>{title}</p>
                <button onClick={callback}>
                    <img className="arrow" src={ArrowDown} alt="" />
                </button>
            </div>
            {children ? children : <InstructionItems start={start} data={data ?? ""} />}
        </div>
    );
};
