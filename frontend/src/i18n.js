import i18n from "i18next";
import languageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

const userLanguage = window.navigator.language;

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .use(Backend)
  .init({
    compatibilityJSON: "v4",
    lng: userLanguage || "en",
    fallbackLng: "en",
    debug: true,
    //keySeparator: false, // we use content as keys
    interpolation: {
      escapeValue: true,
    },
    react: {
      useSuspense: false,
    },
    supportedLngs: ["en", "es", "es-ES"],
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    ns: ["translation"],
    defaultNS: "translation",
  });

export default i18n;
