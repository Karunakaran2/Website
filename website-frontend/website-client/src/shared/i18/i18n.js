import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import translationEN from './locales/en'
import translationHI from './locales/hi'
import appEN from '@/app/i18n/locales/en'
import appHI from '@/app/i18n/locales/hi'
import {
  buildModulePortalSubtitlesEn,
  buildModulePortalSubtitlesHi,
  mergeAppLocalePageSubtitles,
} from '@/app/i18n/buildModulePortalSubtitles'
import authEN from '@/domain/auth/locales/en'
import authHI from '@/domain/auth/locales/hi'

const I18N_DEEP_MERGE_KEYS = new Set(['login', 'profile'])

/** Shallow merge top-level keys; deep-merge selected namespaces so auth overrides do not drop app strings. */
function mergeTranslationLayers(...layers) {
  const merged = {}
  for (const layer of layers) {
    for (const [key, value] of Object.entries(layer)) {
      if (
        I18N_DEEP_MERGE_KEYS.has(key) &&
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        merged[key] &&
        typeof merged[key] === 'object'
      ) {
        merged[key] = { ...merged[key], ...value }
      } else {
        merged[key] = value
      }
    }
  }
  return merged
}

function readInitialLanguage() {
  try {
    const preferred = localStorage.getItem('preferredLanguage')
    if (preferred === 'hi' || preferred === 'en') return preferred
    const raw = localStorage.getItem('probity-a11y')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.language === 'hi') return 'hi'
    }
  } catch {
    /* ignore */
  }
  return 'en'
}

const resources = {
  en: {
    translation: mergeTranslationLayers(
      mergeAppLocalePageSubtitles(appEN, buildModulePortalSubtitlesEn()),
      translationEN,
      authEN,
    ),
  },
  hi: {
    translation: mergeTranslationLayers(
      mergeAppLocalePageSubtitles(appHI, buildModulePortalSubtitlesHi()),
      translationHI,
      authHI,
    ),
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: readInitialLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'preferredLanguage',
      caches: ['localStorage'],
    },
  })

export default i18n
