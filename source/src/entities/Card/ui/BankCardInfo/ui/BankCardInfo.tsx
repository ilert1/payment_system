import { Text } from "@/shared/ui/Text/Text";
import styles from "./BankCardInfo.module.scss";

interface BankCardInfoProps {
    cardNumber: string;
    bankIcon: string;
    onError: (e: any) => void;
}

export const BankCardInfo = (props: BankCardInfoProps) => {
    const { bankIcon, cardNumber, onError } = props;

    return (
        <div className={styles.cardInfo}>
            <img src={bankIcon} onError={onError} alt="" className={styles.img} data-testid="BankCardInfo.BankIcon" />
            <Text text={cardNumber} size="l" />
        </div>
    );
};
