"use client";

import i18next from "i18next";
import { initReactI18next, useTranslation as useTranslationOrg} from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { LocaleKeysType, getOptions } from ".";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((lng: string, ns: string) => import(`./${lng}/${ns}.json`)))
  .init({
    ...getOptions(),
    lng: undefined, // use "detection" option and its order to detect the language on client side
    detection: {
      order: ["path", "htmlTag", "cookie", "navigator"],
    }
  })

const useTranslation = (lang: LocaleKeysType, namespace?: string, options?: {keyPrefix: string}) => {
  if (i18next.resolvedLanguage !== lang) {
    i18next.changeLanguage(lang);
  }
  const { t: translate, i18n } = useTranslationOrg(namespace, options);
  
  return {
    translate,
    i18n,
  }
}

export {
  useTranslation,
}
