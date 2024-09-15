import { useState } from "react";

const LanguageSelector = ({ lang, setLang }) => {
    const [dropDown, setDropDown] = useState(false);
    const langs = ["en-US", "az", "ky", "tg", "kz", "ru-RU", "tr", "uk", "uz"];
    if (!langs.includes(lang)) {
        lang = "en-US";
    }
    const getFlags = lang => {
        let output = [];
        langs.forEach(item => {
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
                        <img src={`/src/assets/images/flags/${item.substring(0, 2)}.svg`} alt="" />
                    </div>
                );
            }
        });
        return output;
    };
    return (
        <div
            className={`language-selector ${dropDown ? "active" : ""}`}
            onClick={() => {
                setDropDown(!dropDown);
            }}>
            <div className="flag-container current-flag">
                <img src={`/src/assets/images/flags/${lang.substring(0, 2)}.svg`} alt="" />
            </div>
            <div className={`drop-down ${dropDown ? "active" : ""}`}>{getFlags(lang)}</div>
        </div>
    );
};

export default LanguageSelector;
