import { useAppContext } from "@/AppContext";
import { LanguageSelector } from "@/widgets/LanguageSelector";

export const Header = () => {
    const { lang, setLang } = useAppContext();

    return (
        <>
            <header>
                <LanguageSelector lang={lang} setLang={setLang} />
            </header>
        </>
    );
};
