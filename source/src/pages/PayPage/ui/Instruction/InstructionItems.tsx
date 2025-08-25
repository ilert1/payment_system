import styles from "./Instruction.module.scss";

interface InstructionItemsProps {
    start: number;
    data: string;
}

export const InstructionItems = (props: InstructionItemsProps) => {
    const { start = 0, data = "" } = props;
    return (
        <ul className={styles.accordionContainerUl}>
            {data.split("|").map((item, index) => (
                <li key={index}>
                    <span>{start + index + 1}. </span>
                    {item}
                </li>
            ))}
        </ul>
    );
};
