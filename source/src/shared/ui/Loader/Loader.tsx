import LoaderIcon from "@/shared/assets/images/loader.svg";
import { Text } from "../Text/Text";
import Timer from "../Timer";
import styles from "./Loader.module.scss";

interface LoaderProps {
    timer?: boolean;
    statusText?: string;
}

export const Loader = ({ timer, statusText }: LoaderProps) => {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.loader}>
                <img src={LoaderIcon} alt="Loader" />
            </div>
            {timer && <Timer />}
            {statusText && <Text className={styles.statusComment} text={statusText} />}
        </div>
    );
};

export default Loader;
