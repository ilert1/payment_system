import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Search from "@/shared/assets/images/search.svg?react";
import { Input } from "@/shared/ui/input/input";
import styles from "./SearchPayMethod.module.scss";

// import Search from "../assets/images/search.svg";

interface SearchPayMethodProps {
    setFilterText: (text: string) => void;
}

export const SearchPayMethod = ({ setFilterText }: SearchPayMethodProps) => {
    const { t } = useTranslation();
    const ns = { ns: ["Common", "SearchPayMethod"] };
    const filterText = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (filterText.current) {
            filterText.current.addEventListener("input", () => {
                setFilterText(filterText.current?.value || "");
            });
        }
    }, []);

    return (
        <div className={styles.searchPayMethod}>
            {/* <img src={Search} alt="" /> */}
            <Search />
            <Input ref={filterText} placeholder={t("transferMethod", ns)} />
        </div>
    );
};

export default SearchPayMethod;
