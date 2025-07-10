import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import Backend from "i18next-http-backend";

// TODO Избавиться от этих уродливых импортов
import translationRU from "@/../public/locales/ru-RU.json";
import translationEN from "@/../public/locales/en-US.json";
import translationAZ from "@/../public/locales/az-AZ.json";
import translationKZ from "@/../public/locales/kk-KZ.json";
import translationKG from "@/../public/locales/ky-KG.json";
import translationTJ from "@/../public/locales/tg-TJ.json";
import translationTR from "@/../public/locales/tr-TR.json";
import translationUA from "@/../public/locales/uk-UA.json";
import translationUZ from "@/../public/locales/uz-UZ.json";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    ru: translationRU,
    en: translationEN,
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

export const getLocalBankName = (display_name = {}, lang: string | null = null) => {
    const d_name: Record<string, string> = display_name;

    if (Object.keys(d_name)?.length) {
        const fallbackName = d_name.hasOwnProperty("name_en")
            ? d_name?.["name_en"]
            : d_name?.[Object.keys(d_name)?.[0]];
        try {
            const currentLang = lang ? lang : getLanguage();
            const currentLangExists = d_name.hasOwnProperty(`name_${currentLang}`);
            return currentLangExists ? d_name?.[`name_${currentLang}`] : fallbackName;
        } catch (e) {
            return fallbackName;
        }
    }
    return "";
};

var language = getLanguage();

i18n.use(initReactI18next)
    // .use(Backend)
    // passes i18n down to react-i18next
    .init({
        resources,
        lng: language, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        fallbackLng: "en",
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option

        interpolation: {
            escapeValue: false // react already safes from xss
        }
        // backend: {
        //     loadPath: "/locales/{{lng}}/{{ns}}.json"
        // }
    });

export default i18n;
