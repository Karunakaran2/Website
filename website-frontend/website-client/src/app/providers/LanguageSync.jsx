import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import i18n from '@/app/i18n/i18n'
import { selectLanguage } from '@/app/settings'

function resolveLanguage(value) {
  return String(value || 'en').toLowerCase().startsWith('hi') ? 'hi' : 'en'
}

export default function LanguageSync() {
  const currentLanguage = useSelector(selectLanguage)

  useEffect(() => {
    const lang = resolveLanguage(currentLanguage)
    const active = resolveLanguage(i18n.resolvedLanguage || i18n.language)
    if (active !== lang) {
      i18n.changeLanguage(lang)
    }
    localStorage.setItem('preferredLanguage', lang)
    document.documentElement.lang = lang
    document.documentElement.classList.toggle('lang-hi', lang === 'hi')
    document.documentElement.classList.toggle('lang-en', lang !== 'hi')
  }, [currentLanguage])

  return null
}
