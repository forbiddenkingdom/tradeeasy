import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// Translations
import globalEs from "translations/es/global";
import globalEn from "translations/en/global";
import elementsEs from "translations/es/elements";
import elementsEn from "translations/en/elements";
import parametersEs from "translations/es/parameters";
import parametersEn from "translations/en/parameters";
import dashboardEn from "translations/en/dashboard";
import dashboardEs from "translations/es/dashboard";
import builderEn from "translations/en/builder";
import builderEs from "translations/es/builder";
import strategiesEn from "translations/en/strategies";
import strategiesEs from "translations/es/strategies";
import validationEn from "translations/en/validation";
import validationEs from "translations/es/validation";
import myValidationEn from "translations/en/myvalidation";
import myValidationEs from "translations/es/myvalidation";
import tradingViewEn from "translations/en/tradingview";
import tradingViewEs from "translations/es/tradingview";
import errorsEn from "translations/en/errors";
import errorsEs from "translations/es/errors";
import freemiumEn from "translations/en/freemium";
import freemiumEs from "translations/es/freemium";
import TimeframeEn from "translations/en/timeframes";
import TimeframesEs from "translations/es/timeframes";
import LoginEs from "translations/es/login";
import LoginEn from "translations/en/login";
import profileEs from "translations/es/profile";
import profileEn from "translations/en/profile";


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false },
    supportedLngs: ["es", "en"],
    fallbackLng: "en",
    resources: {
      es: {
        errors: errorsEs,
        global: globalEs,
        elements: elementsEs,
        parameters: parametersEs,
        dashboard: dashboardEs,
        builder: builderEs,
        strategies: strategiesEs,
        validation: validationEs,
        myValidation: myValidationEs,
        tradingView: tradingViewEs,
        login: LoginEs,
        profile: profileEs,
      },
      en: {
        errors: errorsEn,
        global: globalEn,
        elements: elementsEn,
        parameters: parametersEn,
        dashboard: dashboardEn,
        builder: builderEn,
        strategies: strategiesEn,
        validation: validationEn,
        myValidation: myValidationEn,
        tradingView: tradingViewEn,
        login: LoginEn,
        profile: profileEn,
      },
    },
  });

export default i18n;
