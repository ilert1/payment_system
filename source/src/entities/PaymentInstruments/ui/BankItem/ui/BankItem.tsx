import { useState } from "react";
import DefaultBankIcon from "@/shared/assets/images/bank-icon.svg?react";
import { classNames } from "@/shared/lib/classNames";
import { Text } from "@/shared/ui/Text/Text";
import styles from "./BankItem.module.scss";

interface BankItemProps {
    active: boolean;
    onClick: () => void;
    bankName: string;
    bankIcon: string;
}

export const BankItem = (props: BankItemProps) => {
    const { active, onClick, bankName, bankIcon } = props;
    const [isError, setIsError] = useState(false);

    return (
        <div onClick={onClick} className={classNames(styles.bank_item, { [styles["active"]]: active })}>
            {isError ? (
                <DefaultBankIcon />
            ) : (
                <img
                    src={bankIcon}
                    className={styles.img}
                    onError={e => {
                        e.preventDefault();
                        setIsError(true);
                        // e.target.src = DefaultBankIcon;
                        // e.target.classList.remove("logo");
                    }}
                />
            )}

            <Text text={bankName} />
        </div>
    );
};
