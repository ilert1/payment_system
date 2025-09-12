import { ReactNode } from "react";
import { classNames, Mods } from "@/shared/lib/classNames";
import { Heading } from "@/shared/ui/Heading/Heading";
import { Text } from "@/shared/ui/Text/Text";
import styles from "./HeadingContainer.module.scss";

interface HeadingContainerProps {
    headingText: string | ReactNode;
    description?: string;
    grow?: boolean;
    wide?: boolean;
    center?: boolean;
}
export const HeadingContainer = (props: HeadingContainerProps) => {
    const { headingText, description, grow, wide, center } = props;

    const modClasses: Mods = {
        [styles.grow]: grow,
        [styles.wide]: wide,
        [styles.center]: center
    };

    return (
        <div className={classNames(styles.headingContainer, modClasses)}>
            <Heading title={headingText} size="l" />
            {description && <Text text={description} />}
        </div>
    );
};
