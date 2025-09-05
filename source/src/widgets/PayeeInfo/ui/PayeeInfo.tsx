import UserIcon from "@/shared/assets/images/user.svg?react";
import styles from "./PayeeInfo.module.scss";

interface PayeeInfoProps {
    PayeeName: string;
    showPayeeData?: boolean;
}

export const PayeeInfo = (props: PayeeInfoProps) => {
    const { PayeeName, showPayeeData = false } = props;
    // const [showPopup, setShowPopup] = useState(false);

    // const { t } = useContext(AppContext);
    //translation
    // const ns = { ns: "PayeeInfo" };

    // let popupTimeout = null;

    /* const showPopupCallback = e => {
        e.preventDefault();
        clearTimeout(popupTimeout);

        setShowPopup(!showPopup);
    }; */

    /* useEffect(() => {
        if (showPopup) {
            popupTimeout = setTimeout(() => {
                setShowPopup(false);
            }, 3000);
        }
        return () => {
            clearTimeout(popupTimeout);
        };
    }, [showPopup]); */

    return (
        <div className={styles.payeeInfoContainer}>
            {/* <img src={UserIcon} alt="" /> */}
            <UserIcon />
            <p className="payee-name">{PayeeName}</p>
            {/* {showPayeeData && (
                <div className="payee-container">
                    <a href="" onClick={showPopupCallback}>
                        {t("payeeInfo", ns)}
                    </a>
                    <PayeeHint showPopup={showPopup} payeeData={PayeeName} />
                </div>
            )} */}
        </div>
    );
};
