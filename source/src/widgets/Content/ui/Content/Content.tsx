import { ReactNode } from "react";
import styles from "./Content.module.scss";

interface ContentProps {
    children: ReactNode;
}

export const Content = (props: ContentProps) => {
    const { children } = props;

    return <div className={styles.content}>{children}</div>;
};
