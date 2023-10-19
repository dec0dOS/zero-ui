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
    fallbackLng: "en",
    detection: {
      order: ["path", "cookie", "localStorage", "htmlTag"],
      caches: ["localStorage", "cookie"],
    },
    debug: true,
    interpolation: {
      escapeValue: true,
    },
    react: {
      useSuspense: true,
    },
    supportedLngs: ["en", "es-ES"],
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    ns: ["common"],
    defaultNS: "common",
  });

export default i18n;
