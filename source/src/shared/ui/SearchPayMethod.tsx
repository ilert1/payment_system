import { useEffect, useRef, useContext } from "react";
import { Input } from "./input/input";
import { AppContext } from "@/AppContext";
import { useTranslation } from "react-i18next";
import Search from "../assets/images/search.svg?react";

// import Search from "../assets/images/search.svg";

export const SearchPayMethod = ({ setFilterText }) => {
    const { t } = useTranslation();
    const ns = { ns: ["Common", "SearchPayMethod"] };
    const filterText = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (filterText.current) {
            filterText.current.addEventListener("input", () => {
                setFilterText(filterText.current?.value);
            });
        }
    }, []);

    return (
        <div className="search-pay-method">
            {/* <img src={Search} alt="" /> */}
            <Search />
            {/* <input ref={filterText} type="text" placeholder={t("transferMethod", ns)} /> */}
            <Input ref={filterText} type="text" placeholder={t("transferMethod", ns)} />
        </div>
    );
};

export default SearchPayMethod;
