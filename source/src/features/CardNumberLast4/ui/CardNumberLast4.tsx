import { useRef, useEffect } from "react";
import { Text } from "@/shared/ui/Text/Text";
import { Input } from "@/shared/ui/input/input";
import styles from "./CardNumberLast4.module.scss";

interface CardNumberLast4Props {
    onComplete?: (val: string) => void;
    showHidden: boolean;
}

export const CardNumberLast4 = (props: CardNumberLast4Props) => {
    const { onComplete, showHidden } = props;

    const inputs = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!inputs.current) return;

        const items = inputs.current.children;

        for (let i = 0; i < items.length; i++) {
            items[i].addEventListener("input", () => {
                if (items[i].nodeValue != "") {
                    if (i >= items.length - 1) {
                        const numbers = [];
                        for (let j = 0; j < items.length; j++) {
                            numbers.push(items[j].nodeValue);
                        }
                        onComplete?.(numbers.join(""));
                    } else {
                        (items[i + 1] as HTMLElement).focus();
                    }
                }
            });
        }

        (items[0] as HTMLElement).focus();
    }, []);

    return (
        <div className={styles.cardNumberContainer}>
            {showHidden ? <Text className={styles.p} size="xl" weight="semiBold" text={"**** **** ****"} /> : ""}
            <div ref={inputs} className={styles.inputs}>
                <Input type="text" className={styles.input} bgWhite maxLength={1} inputMode="numeric" />
                <Input type="text" className={styles.input} bgWhite maxLength={1} inputMode="numeric" />
                <Input type="text" className={styles.input} bgWhite maxLength={1} inputMode="numeric" />
                <Input type="text" className={styles.input} bgWhite maxLength={1} inputMode="numeric" />
            </div>
        </div>
    );
};

export default CardNumberLast4;
