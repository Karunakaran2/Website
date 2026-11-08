import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronDown, Globe } from 'lucide-react'
import { setLanguage } from '@/shared/redux/slices/language/languageSlice'

const OPTIONS = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'HI' },
]

export default function LoginFormLanguageSelect() {
  const { i18n, t } = useTranslation()
  const dispatch = useDispatch()
  const listId = useId()
  const [open, setOpen] = useState(false)
  const { currentLanguage } = useSelector((state) => state.language) || {}
  const langCode = String(currentLanguage || i18n.language || 'en')
    .split('-')[0]
    .toLowerCase()
  const active = OPTIONS.find((o) => o.code === langCode) || OPTIONS[0]

  const select = (code) => {
    dispatch(setLanguage(code))
    i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-[#0D2EAB] bg-white px-4 font-noto text-xs font-semibold text-[#263AB5]"
      >
        <Globe className="h-4 w-4 text-[#263AB5]" aria-hidden />
        {active.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute right-0 top-[calc(100%+4px)] z-50 min-w-[5rem] overflow-hidden rounded-2xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {OPTIONS.map((opt) => (
            <li key={opt.code} role="option" aria-selected={opt.code === active.code}>
              <button
                type="button"
                onClick={() => select(opt.code)}
                className={`block w-full cursor-pointer border-0 bg-transparent px-3 py-2 text-left font-noto text-xs font-semibold ${
                  opt.code === active.code
                    ? 'bg-sky-50 text-[#01458e]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default border-0 bg-transparent p-0"
          aria-label={t('login.closeLanguageMenu', 'Close language menu')}
          onClick={() => setOpen(false)}
        />
      ) : null}
    </div>
  )
}
