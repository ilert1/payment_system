import { useMemo, useState } from "react";

const LanguageSelector = ({ lang, setLang }) => {
    const [dropDown, setDropDown] = useState(false);
    const langs = ["en", "az", "ky", "tg", "kk", "ru", "tr", "uk", "uz"];
    if (
        lang &&
        !langs.find(item => {
            return lang.indexOf(item) == 0;
        })
    ) {
        lang = "en";
    }
    const flags = useMemo(() => {
        let output = [];
        langs?.forEach(item => {
            if (lang.substring(0, 2) != item) {
                output.push(
                    <div
                        key={`flagid_${item}`}
                        className="flag-container"
                        data-lang={item}
                        onClick={() => {
                            setLang(item);
                        }}>
                        <p className="lang-name">{item.toUpperCase()}</p>
                        <img src={`/flags/${item}.svg`} alt="" />
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
