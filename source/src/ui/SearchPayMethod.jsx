import { useEffect, useRef, useContext } from "react";
import AppContext from "../AppContext";

import Search from "../assets/images/search.svg";

export const SearchPayMethod = ({ setFilterText }) => {
    const { t } = useContext(AppContext);
    //translation
    const ns = { ns: ["Common", "SearchPayMethod"] };

    const filterText = useRef();

    useEffect(() => {
        filterText.current.addEventListener("input", () => {
            setFilterText(filterText.current.value);
        });
    }, []);

    return (
        <div className="search-pay-method">
            <img src={Search} alt="" />
            <input ref={filterText} type="text" placeholder={t("transferMethod", ns)} />
        </div>
    );
};

export default SearchPayMethod;
