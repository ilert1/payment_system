import Timer from "../Timer";
import LoaderIcon from "../assets/images/loader.svg";
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
            {statusText && <p className={styles.statusComment}>{statusText}</p>}
        </div>
    );
};

export default Loader;
