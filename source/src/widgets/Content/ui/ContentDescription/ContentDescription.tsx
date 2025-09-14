import { ReactNode } from "react";
import { classNames } from "@/shared/lib/classNames";
import { Text } from "@/shared/ui/Text/Text";
import styles from "./ContentDescription.module.scss";

interface ContentDescriptionProps {
    text: string | ReactNode;
    lowMb?: boolean;
    grow?: boolean;
    lowMt?: boolean;
}

export const ContentDescription = (props: ContentDescriptionProps) => {
    const { text, lowMb, grow, lowMt } = props;

    const modClasses = {
        [styles.lowMb]: lowMb,
        [styles.grow]: grow,
        [styles.lowMt]: lowMt
    };

    return (
        <div className={classNames(styles.description, modClasses)}>
            {typeof text === "string" ? <Text align="center" text={text} /> : text}
        </div>
    );
};
