import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import pl from './locales/pl.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import it from './locales/it.json'
import de from './locales/de.json'

export const SUPPORTED_LANGUAGES = ['en', 'pl', 'es', 'fr', 'it', 'de'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {translation: en},
      pl: {translation: pl},
      es: {translation: es},
      fr: {translation: fr},
      it: {translation: it},
      de: {translation: de},
    },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {escapeValue: false},
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'rosary-language',
    },
  })

export default i18n
