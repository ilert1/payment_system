import { useAppContext } from "@/AppContext";
import { LanguageSelector } from "@/widgets/LanguageSelector";
import styles from "./Header.module.scss";

export const Header = () => {
    const { lang, setLang } = useAppContext();

    return (
        <>
            <header className={styles.header}>
                <LanguageSelector lang={lang} setLang={setLang} />
            </header>
        </>
    );
};
