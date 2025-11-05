import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

// // the translations
// // (tip move them in a JSON file and import them,
// // or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    ru: "ru-RU",
    en: "en-US",
    az: "az-AZ",
    kk: "kk-KZ",
    ky: "ky-KG",
    tg: "tg-TJ",
    tr: "tr-TR",
    uk: "uk-UA",
    uz: "uz-UZ",
    es: "es-ES",
    bn: "bn-BD"
};

export const getLanguage = () => {
    let language = navigator.language;
    const storedLang = localStorage.getItem("language");
    language = storedLang ? storedLang : language;
    localStorage.setItem("language", language);
    return language;
};

const language = getLanguage();

i18n.use(initReactI18next)
    .use(Backend)
    // passes i18n down to react-i18next
    .init({
        // resources,
        lng: language, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        fallbackLng: "en-US",
        backend: {
            // loadPath: "/locales/{{lng}}/{{ns}}.json"
            loadPath: (lngs: string[], namespaces: string[]) => {
                const lang = resources[lngs[0] as keyof typeof resources];
                // console.log(namespaces);
                if (!lang) {
                    return `/locales/en-US/${namespaces[0]}.json`;
                }
                return `/locales/${lang}/${namespaces[0]}.json`;
            }
        },
        // debug: true,
        // "Common"
        ns: [
            "Common",
            "Footer",
            "GeneralError",
            "Main",
            "Pay",
            "PayeeCard",
            "PayeeData",
            "PayeeHint",
            "PayeeInfo",
            "PayeeSearch",
            "PayerData",
            "PayError",
            "PayHeader",
            "PaymentInstrument",
            "PayMethod",
            "PayOut",
            "PleasePay",
            "ProgressSteper",
            "Rating",
            "SearchPayMethod",
            "Success",
            "SupportDialog",
            "ThreeDsPage"
        ],
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option

        interpolation: {
            escapeValue: false // react already safes from xss
        },
        react: {
            useSuspense: true
        }
        // backend: {
        //     loadPath: "/locales/{{lng}}/{{ns}}.json"
        // }
    });

export default i18n;
