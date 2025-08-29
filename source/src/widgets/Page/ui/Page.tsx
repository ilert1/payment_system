import { Header } from "@/widgets/Header";
import styles from "./Page.module.scss";

interface PageProps {
    children: React.ReactNode;
    header?: boolean;
}

export const Page = (props: PageProps) => {
    const { children, header = true } = props;

    return (
        <div className={styles.container}>
            {header && <Header />}
            {children}
        </div>
    );
};
