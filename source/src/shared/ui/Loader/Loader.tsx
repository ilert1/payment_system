import LoaderIcon from "@/shared/assets/images/loader.svg?react";
import { Text } from "../Text/Text";
import Timer from "../Timer/Timer";
import styles from "./Loader.module.scss";

interface LoaderProps {
    timer?: boolean;
    statusText?: string;
}

export const Loader = ({ timer, statusText }: LoaderProps) => {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.loader}>
                <LoaderIcon className={styles.img} />
            </div>
            {timer && <Timer />}
            {statusText && <Text className={styles.statusComment} text={statusText} />}
        </div>
    );
};

export default Loader;
