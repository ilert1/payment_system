import SupportDialog from "../widgets/SupportDialog";

import { useContext } from "react";
import AppContext from "../AppContext";

import LanguageSelector from "./LanguageSelector";

const Header = () => {
    // const { isActive, setIsActive } = useContext(AppContext).supportDialog;
    const { lang, setLang } = useContext(AppContext);

    return (
        <>
            <header>
                <LanguageSelector lang={lang} setLang={setLang} />
            </header>
        </>
    );
};

export default Header;
