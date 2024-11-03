/* eslint-disable react/prop-types */
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Slide } from "react-toastify";

const CloseButton = ({ closeToast }) => (
    <button className="toast__close-btn" onClick={closeToast}>
        Окей
    </button>
);

export default function CustomToastContainer() {
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
        />
    );
}
