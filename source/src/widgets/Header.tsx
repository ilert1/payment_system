import { useAppContext } from "../AppContext";

import LanguageSelector from "./LanguageSelector";

const Header = () => {
    const { lang, setLang } = useAppContext();

    return (
        <>
            <header>
                <LanguageSelector lang={lang} setLang={setLang} />
            </header>
        </>
    );
};

export default Header;
