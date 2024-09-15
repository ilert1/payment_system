import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationRU from "./locales/ru-RU.json";
import translationEN from "./locales/en-US.json";
import translationAZ from "./locales/az-AZ.json";
import translationKZ from "./locales/kk-KZ.json";
import translationKG from "./locales/ky-KG.json";
import translationTJ from "./locales/tg-TJ.json";
import translationTR from "./locales/tr-TR.json";
import translationUA from "./locales/uk-UA.json";
import translationUZ from "./locales/uz-UZ.json";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    "ru-RU": translationRU,
    "en-US": translationEN,
    az: translationAZ,
    kk: translationKZ,
    ky: translationKG,
    tg: translationTJ,
    tr: translationTR,
    uk: translationUA,
    uz: translationUZ
};

export const getLanguage = () => {
    let language = navigator.language;
    let storedLang = localStorage.getItem("language");
    language = storedLang ? storedLang : language;
    localStorage.setItem("language", language);
    return language;
};

var language = getLanguage();

getLanguage;

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: language, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // lng: "ru-RU",
        fallbackLng: "en-US",
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
