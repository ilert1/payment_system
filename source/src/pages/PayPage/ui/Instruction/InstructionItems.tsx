import styles from "./InstructionItems.module.scss";

interface InstructionItemsProps {
    start?: number;
    data: string;
}

const parseWithSpan = (str: string) => {
    const parts = str.split(/(<s>|<\/s>)/g);
    let inside = false;

    return parts.map((part, i) => {
        if (part.startsWith("<s")) {
            inside = true;
            return null;
        }
        if (part === "</s>") {
            inside = false;
            return null;
        }
        return inside ? <span key={i}>{part}</span> : part;
    });
};

const LocalizedHtml = ({ text }: { text: string }) => {
    return <>{parseWithSpan(text)}</>;
};

export const InstructionItems = (props: InstructionItemsProps) => {
    const { start = 0, data = "" } = props;
    return (
        <ul className={styles.ul}>
            {data.split("|").map((item, index) => (
                <li className={styles.li} key={index}>
                    <span className={styles.span}>{start + index + 1}. </span>
                    <LocalizedHtml text={item} />
                </li>
            ))}
        </ul>
    );
};
