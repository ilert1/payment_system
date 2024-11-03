import { useMemo, useState } from "react";

const LanguageSelector = ({ lang, setLang }) => {
    const [dropDown, setDropDown] = useState(false);
    const langs = ["en-US", "az", "ky", "tg", "kk", "ru-RU", "tr", "uk", "uz"];
    if (
        !langs.find(item => {
            return item.indexOf(lang) == 0;
        })
    ) {
        lang = "en-US";
    }
    const flags = useMemo(() => {
        let output = [];
        langs?.forEach(item => {
            if (lang.substring(0, 2) != item.substring(0, 2)) {
                output.push(
                    <div
                        key={`flagid_${item}`}
                        className="flag-container"
                        data-lang={item}
                        onClick={() => {
                            setLang(item);
                        }}>
                        <p className="lang-name">{item.substring(0, 2).toUpperCase()}</p>
                        <img src={`/flags/${item.substring(0, 2)}.svg`} alt="" />
                    </div>
                );
            }
        });
        // console.log(output);
        return output;
    }, [lang]);

    return (
        <div
            className={`language-selector ${dropDown ? "active" : ""}`}
            onClick={() => {
                setDropDown(!dropDown);
            }}>
            <div className="flag-container current-flag">
                <img src={`/flags/${lang.substring(0, 2)}.svg`} alt="" />
            </div>
            <div className={`drop-down ${dropDown ? "active" : ""}`}>{flags}</div>
        </div>
    );
};

export default LanguageSelector;
