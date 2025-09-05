import { useMemo, useState } from "react";
import { useAppContext } from "@/AppContext";
import { classNames } from "@/shared/lib/classNames";
import styles from "./LanguageSelector.module.scss";

interface LanguageSelectorProps {
    lang: string;
    setLang: (val: string) => void;
}
const LangVariants = {
    en: "en-US",
    az: "az-AZ",
    ky: "ky-KG",
    tg: "tg-TJ",
    kk: "kk-KZ",
    ru: "ru-RU",
    tr: "tr-TR",
    uk: "uk-UA",
    uz: "uz-UZ",
    es: "es-ES"
};

export const LanguageSelector = (props: LanguageSelectorProps) => {
    const { ym } = useAppContext();

    const { lang = "en", setLang } = props;

    const [dropDown, setDropDown] = useState(false);

    const flags = useMemo(() => {
        let output: any[] = [];

        Object.keys(LangVariants)?.forEach((item: string) => {
            const langItem = item;

            if (lang.substring(0, 2) != langItem) {
                output.push(
                    <div
                        key={`flagid_${langItem}`}
                        className={classNames(styles.flagContainer)}
                        data-lang={langItem}
                        onClick={() => {
                            console.log(`selected lang: ${langItem}`);
                            ym("reachGoal", "lang-select", { selectedLang: langItem });
                            setLang(langItem);
                        }}>
                        <p>{langItem.toUpperCase()}</p>
                        <img src={`/flags/${langItem}.svg`} alt={langItem} />
                    </div>
                );
            }
        });
        return output;
    }, [lang]);

    return (
        <div
            className={classNames(styles.languageSelector, { [styles.active]: dropDown })}
            onClick={() => {
                setDropDown(!dropDown);
            }}>
            <div className={styles.flagContainer}>
                <img src={`/flags/${lang.substring(0, 2)}.svg`} alt={lang} />
            </div>
            <div className={classNames(styles.dropDown, { [styles.active]: dropDown })}>{flags}</div>
        </div>
    );
};
