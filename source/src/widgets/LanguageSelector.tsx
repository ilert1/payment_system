import { useMemo, useState } from "react";

const LangVariants = { en: "en", az: "az", ky: "ky", tg: "tg", kk: "kk", ru: "ru", tr: "tr", uk: "uk", uz: "uz" };
type LangType = keyof typeof LangVariants;

interface LanguageSelectorProps {
    lang: LangType;
    setLang: (val: LangType) => void;
}

const LanguageSelector = (props: LanguageSelectorProps) => {
    const { lang = "en", setLang } = props;

    const [dropDown, setDropDown] = useState(false);

    const flags = useMemo(() => {
        let output: any[] = [];

        Object.keys(LangVariants)?.forEach((item: string) => {
            const langItem = item as LangType;
            if (lang.substring(0, 2) != langItem) {
                output.push(
                    <div
                        key={`flagid_${langItem}`}
                        className="flag-container"
                        data-lang={langItem}
                        onClick={() => {
                            setLang(langItem);
                        }}>
                        <p className="lang-name">{langItem.toUpperCase()}</p>
                        <img src={`/flags/${langItem}.svg`} alt={langItem} />
                    </div>
                );
            }
        });
        return output;
    }, [lang]);

    return (
        <div
            className={`language-selector ${dropDown ? "active" : ""}`}
            onClick={() => {
                setDropDown(!dropDown);
            }}>
            <div className="flag-container current-flag">
                <img src={`/flags/${lang.substring(0, 2) as LangType}.svg`} alt={lang} />
            </div>
            <div className={`drop-down ${dropDown ? "active" : ""}`}>{flags}</div>
        </div>
    );
};

export default LanguageSelector;
