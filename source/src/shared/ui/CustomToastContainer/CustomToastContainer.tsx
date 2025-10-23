 
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./CustomToastContainer.module.scss";

const CloseButton = () => <button className={styles.toastCloseBtn}>Окей</button>;

export function CustomToastContainer() {
    return (
        <ToastContainer
            limit={3}
            icon={false}
            position="top-center"
            autoClose={5000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Slide}
            closeButton={CloseButton}
            data-testid="custom-toast-container"
        />
    );
}
